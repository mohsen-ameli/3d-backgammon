import { useGLTF } from "@react-three/drei"
import { createContext, useContext, useEffect, useRef, useState } from "react"

import gltfModel from "../../assets/models/models.glb"
import userSwitchAudio from "../../assets/sounds/user-switch.mp3"
import { Children } from "../../components/types/children.type"
import notification from "../../components/utils/Notification"
import toCapitalize from "../../components/utils/ToCapitalize"
import getServerUrl from "../../components/utils/getServerUrl"
import { AuthContext } from "../../context/AuthContext"
import { DEFAULT_CHECKER_POSITIONS, DEFAULT_SETTINGS } from "../data/Data"
import { CheckerType } from "../types/Checker.type"
import { DiceMoveType, DicePhysics } from "../types/Dice.type"
import { GLTFResult } from "../types/GLTFResult.type"
import * as types from "../types/Game.type"
import switchPlayers from "../utils/SwitchPlayers"

// The grandiose game state. This is where the magic is held in place.
export const GameContext = createContext({} as types.GameContextType)

const GameContextProvider = ({ children }: Children) => {
  // Auth context
  const { user } = useContext(AuthContext)

  // Loading the models
  const { nodes, materials } = useGLTF(gltfModel) as GLTFResult

  /**
   * Functions
   */

  // Toggles orbit controls. Defined in the Controls component
  const toggleControls = useRef(() => null)

  // Resets orbit controls. Defined in the Controls component
  const resetOrbit = useRef(() => null)

  // Throws the dice onto the board. Defined in Dices
  const throwDice = useRef(() => null)

  /**
   * Game refs
   */

  // Game mode
  const gameMode = useRef<types.GameModeType>()

  // The current checker color that is being moved
  const userChecker = useRef<types.UserCheckerType>()

  // The current checker color that is being moved
  const winner = useRef<types.PlayerType>()

  // The numbers on the dice, and how many times the user is allowed to move
  const dice = useRef<DiceMoveType>({ dice1: 0, dice2: 0, moves: 0 })

  // Dice physics
  const dicePhysics = useRef<DicePhysics>()

  // All of the checkers' default positions
  const checkers = useRef<CheckerType[]>(null!)

  // If the checker has been picked up or not
  const checkerPicked = useRef<types.CheckerPickedType>(null)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef<number | undefined>()

  // Timer used to keep track of both user's time remaining
  const timer = useRef<types.TimerType>()

  /**
   * States
   */

  // If the game has started, and user is looking at the board
  const [initial, setInitial] = useState({
    doneLoading: false,
    initialLoad: true,
  })

  // Current players (Only set in a live game)
  const [players, setPlayers] = useState<types.PlayersType>()

  // Boolean to keep track of if it's the user's turn or not
  const [myTurn, setMyTurn] = useState(true)

  // Game websocket
  const [ws, setWs] = useState<WebSocket>()

  // Whether the user is in game
  const [inGame, setInGame] = useState(false)

  // Whether to show the throw button
  const [showThrow, setShowThrow] = useState<boolean | null>(false)

  // The current phase of the game
  const [phase, setPhase] = useState<types.PhaseType>()

  // Settings object
  const [settings, setSettings] = useState<types.SettingsType>(DEFAULT_SETTINGS)

  // In game messages
  const [messages, setMessages] = useState<types.MessageType>(null)

  // Audio to play when users switch
  const [audio] = useState(() => new Audio(userSwitchAudio))

  // User is resigning.. what a loser
  const resign = (winnerId: number, loserId: number, send: boolean = false) => {
    const context = JSON.stringify({
      resign: true,
      winner: winnerId,
      resigner: loserId,
    })

    if (send) {
      ws?.send(context)
      return
    }

    const msg = "Confirm resignation?"
    notification(msg, "resign", undefined, undefined, () => ws?.send(context))
  }

  // User is connecting to the game initially
  const onOpen = () => ws?.send(JSON.stringify({ initial: true }))

  // Backend has sent game updates
  const onMessage = (e: MessageEvent) => {
    const data: types.GameDataTypes = JSON.parse(e.data)

    // If there are too many sessions active
    // if (data.too_many_users) {
    // const errorMsg = "Please continue this game on your other active session!"
    // notification(errorMsg, "error")
    // return
    // }

    // If game has ended
    if (data.finished) {
      winner.current = data.winner

      // Showing a notification of the winner
      if (data.resigner) {
        setTimeout(() => {
          notification(
            `${toCapitalize(data.resigner?.name!)} has resigned the game.`
          )
        }, 500)
      }

      // TODO: Maybe add some confetti?

      // Cleaning
      dice.current = { dice1: 0, dice2: 0, moves: 0 }
      userChecker.current = undefined
      setPhase("ended")
      setWs(undefined)
      setInGame(false)

      return
    }

    // If there is a chat message
    if (data.message) {
      setMessages({ userId: data.user_id!, message: data.message })
      return
    }

    // If there are dice physics info
    // There are two ways to this. Either the user who is spectating is getting the other user's dice physic info,
    // or it's the current user, who's getting it. If it's the current user, then return immediately,
    if (data.physics) {
      if (user?.user_id === data.physics.user.id) return

      // Throw the dice for the other user
      setPhase("diceSync")
      dicePhysics.current = data.physics
      return
    }

    userChecker.current = data.turn!
    checkers.current = data.board!
    dice.current = data.dice!
    timer.current = data.player_timer

    // Settings user turn
    let turn = false
    if (
      (data.white === user?.user_id && userChecker.current === "white") ||
      (data.black === user?.user_id && userChecker.current === "black")
    ) {
      turn = true
    }

    setMyTurn(turn)

    // Setting the phase to initial
    if (data.initial) {
      // If user has, for some reason, thrown the dice, then maybe left the page
      // and the dice numbers weren't detected in time, and then they come back
      // then we want to throw the dice for them
      if (
        data.initial_physics &&
        Object.keys(data.initial_physics).length !== 0 &&
        data.initial_physics.user.id === user?.user_id! &&
        turn &&
        dice.current.moves === 0
      ) {
        setPhase("diceRollPhysics")
        dicePhysics.current = data.initial_physics
      } else {
        setPhase("initial")
      }

      // Filling the players reference
      const myColor = data.white === user?.user_id! ? "white" : "black"

      const me = {} as types.PlayerType
      me.id = user?.user_id!
      me.name = user?.username!
      me.image = (myColor === "white" ? data.white_image! : data.black_image!) //prettier-ignore
      me.color = myColor

      const enemy = {} as types.PlayerType
      enemy.id = myColor === "white" ? data.black! : data.white!
      enemy.name = myColor === "white" ? data.black_name! : data.white_name! //prettier-ignore
      enemy.image = (myColor === "white" ? data.black_image! : data.white_image!) //prettier-ignore
      enemy.color = switchPlayers(myColor)

      setPlayers({ me, enemy })

      return
    }

    // if user is playing or spectating
    if (dice.current.moves !== 0) {
      // Complicated state changes. Essentially making sure that
      // whether the user is spectating or playing, they get the
      // newest updates from the backend. (aka, making sure
      // all the checker positions are updated)

      if (!turn)
        setPhase(curr => (curr === "spectate" ? "spectating" : "spectate"))
      else
        setPhase(curr =>
          curr === "checkerMove" ? "checkerMoveAgain" : "checkerMove"
        )

      return
    }

    // Making sure there is a rerender in the checkers component so that both user's boards get updated
    setPhase(curr => (curr === "diceRollAgain" ? "diceRoll" : "diceRollAgain"))
  }

  // User has entered the game
  useEffect(() => {
    if (!inGame) return

    // GameMode is pass and play
    if (gameMode.current === "pass-and-play") {
      setPhase("initial")
      userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))

      const me = {} as types.PlayerType
      me.id = user?.user_id!
      me.name = user?.username!
      me.image = ""
      me.color = userChecker.current

      setPlayers({ me, enemy: { id: 0, color: "white", image: "", name: "" } })

      return
    }

    // User is playing a live game
    const gameId = gameMode.current?.split("_")[1]
    const url = `${getServerUrl(false)}/ws/game/${gameId}/`
    setWs(() => new WebSocket(url))
  }, [inGame])

  // Connecting to the backend (live game)
  useEffect(() => {
    if (!ws) return

    ws.onopen = onOpen
    ws.onmessage = onMessage

    return () => ws.close()
  }, [ws])

  // Playing sound effect when the user changes
  useEffect(() => {
    if (settings.sound && (phase === "diceRoll" || phase === "diceRollAgain")) {
      audio.play().catch(() => {})
    }
  }, [phase, myTurn])

  // Game state values
  const value = {
    // Functions
    toggleControls,
    resetOrbit,
    resign,
    throwDice,

    // Refs
    gameMode,
    userChecker,
    players,
    winner,
    dice,
    dicePhysics,
    checkers,
    checkerPicked,
    newCheckerPosition,
    timer,

    // States
    setInitial,
    initial,
    myTurn,
    ws,
    messages,
    inGame,
    setInGame,
    showThrow,
    setShowThrow,
    phase,
    setPhase,
    settings,
    setSettings,

    // Other
    nodes,
    materials,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

useGLTF.preload(gltfModel)

export default GameContextProvider
