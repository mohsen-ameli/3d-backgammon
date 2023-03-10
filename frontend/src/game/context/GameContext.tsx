import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useGLTF } from "@react-three/drei"

import { Children } from "../../components/children.type"
import { DiceMoveType, DicePhysics } from "../types/Dice.type"
import * as types from "../types/Game.type"
import { CheckerType } from "../types/Checker.type"
import { GLTFResult } from "../types/GLTFResult.type"
import getServerUrl from "../../components/utils/getServerUrl"
import { AuthContext } from "../../context/AuthContext"
import { DEFAULT_CHECKER_POSITIONS } from "../data/Data"
import switchPlayers from "../utils/SwitchPlayers"
import notification from "../../components/utils/Notification"
import toCapitalize from "../../components/utils/ToCapitalize"
import userSwitchAudio from "../../assets/sounds/user-switch.mp3"
import gltfModel from "../../assets/models/models.glb"

// The grandious game state. This is where the magic is held in place.
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

  // Toggles the zoom on orbit controls. Defined in the Controls component
  const toggleZoom = useRef(() => null)

  // Throws the dice onto the board. Defined in Dices
  const throwDice = useRef(() => null)

  /**
   * Game refs
   */

  // Game mode
  const gameMode = useRef<types.GameModeType>()

  // The current checker color that is being moved
  const userChecker = useRef<types.UserCheckerType>()

  // Current players (Only set in a live game)
  const players = useRef<types.PlayersType>({
    me: { id: 0, name: "", image: "", color: "white" },
    enemy: { id: 0, name: "", image: "", color: "white" },
  })

  // The current checker color that is being moved
  const winner = useRef<types.PlayerType>()

  // The numbers on the dice, and how many times the user is allowed to move
  const dice = useRef<DiceMoveType>({ dice1: 0, dice2: 0, moves: 0 })

  // Dice physics
  const dicePhysics = useRef<DicePhysics>()

  // All of the checkers' default positions
  const checkers = useRef<CheckerType[]>(null!)

  // If the checker has been picked up or not
  const checkerPicked = useRef(false)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef<number | undefined>()

  // Timer used to keep track of both user's time remaining
  const timer = useRef<types.TimerType>()

  /**
   * States
   */

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

  // Plays the audio switching users
  const playAudio = () => audio.play().catch(() => {})

  // User is connecting to the game initially
  const onOpen = () => ws?.send(JSON.stringify({ initial: true }))

  // Backend has sent game updates
  const onMessage = useCallback((e: MessageEvent) => {
    const data: types.GameDataTypes = JSON.parse(e.data)

    // If there are too many sessions active
    if (data.too_many_users) {
      const errorMsg = "Please continue this game on your other active session!"
      // notification(errorMsg, "error")
      return
    }

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
      } else {
        notification(`${toCapitalize(data.winner?.name!)} is the winner!`)
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
      const msg = `${data.user} said ${data.message}`
      notification(msg, "messsage")
      return
    }

    // If there are dice physics info
    // There are two ways to this. Either the user who is spectating is getting the other user's dice phycis info,
    // or it's the current user, who's getting it. If it's the current user, then return immidietly,
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
    if (data.initial && players.current && user) {
      // If user has, for some reason, thrown the dice, then maybe left the page
      // and the dice numbers weren't detected in time, and then they come back
      // then we want to throw the dice for them
      if (
        data.initial_physics &&
        Object.keys(data.initial_physics).length !== 0 &&
        data.initial_physics.user.id === user.user_id &&
        turn &&
        dice.current.moves === 0
      ) {
        setPhase("diceRollPhysics")
        dicePhysics.current = data.initial_physics
      } else {
        setPhase("initial")
      }

      // Filling the players reference
      const myColor = data.white === user.user_id ? "white" : "black"

      players.current.me.id = user.user_id
      players.current.me.name = user.username
      players.current.me.image = (myColor === "white" ? data.white_image! : data.black_image!) //prettier-ignore
      players.current.me.color = myColor

      players.current.enemy.id = myColor === "white" ? data.black! : data.white!
      players.current.enemy.name = myColor === "white" ? data.black_name! : data.white_name! //prettier-ignore
      players.current.enemy.image = (myColor === "white" ? data.black_image! : data.white_image!) //prettier-ignore
      players.current.enemy.color = switchPlayers(myColor)

      return
    }

    // if user is playing or spectating
    if (dice.current.moves !== 0) {
      // Complicated state changes. Essentially making sure that
      // whether the user is spectating or playing, they get the
      // neweset updates from the backend. (aka, making sure
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
  }, [])

  // User has entered the game
  useEffect(() => {
    if (!inGame) return

    // GameMode is pass and play
    if (gameMode.current === "pass-and-play") {
      setPhase("initial")
      userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
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
    if (phase === "diceRoll" || phase === "diceRollAgain") playAudio()
  }, [phase, myTurn])

  // Game state values
  const value = {
    // Functions
    toggleControls,
    resetOrbit,
    toggleZoom,
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
    myTurn,
    ws,
    inGame,
    setInGame,
    showThrow,
    setShowThrow,
    phase,
    setPhase,

    // Other
    nodes,
    materials,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

useGLTF.preload(gltfModel)

export default GameContextProvider
