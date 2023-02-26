import { useGLTF } from "@react-three/drei"
import { useEffect, createContext, useContext, useRef, useState } from "react"
import { Debug, Physics } from "@react-three/rapier"
import { GLTFResult } from "./types/GLTFResult.type"

import Dices from "./dice/Dices"
import UI from "./ui/UI"
import Checkers from "./checkers/Checkers"
import Board from "./Board"
import Columns from "./Columns"
import Controls from "./Controls"
import * as types from "./types/Game.type"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { AuthContext } from "../context/AuthContext"
import notification from "../components/utils/Notification"
import toCapitalize from "../components/utils/ToCapitalize"
import getServerUrl from "../components/utils/getServerUrl"
import gltfModel from "../assets/models/models.glb"
import userSwitch from "../assets/sounds/user-switch.mp3"
import useViewPort from "./utils/useViewPort"
import { CheckerType } from "./types/Checker.type"
import { DiceType } from "./types/Dice.type"
import Stage from "./Stage"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext({} as types.GameStateType)

const Game = () => {
  const { user, inGame, gameMode } = useContext(AuthContext)

  // View port
  useViewPort()

  // Orbit control functions. These are defined in the Controls component
  const resetOrbit = useRef(() => null)
  const toggleControls = useRef(() => null)
  const toggleZoom = useRef(() => null)

  // Current players (Only set in a live game)
  const players = useRef<types.PlayersType>({
    me: { id: 0, name: "", color: "white" },
    enemy: { id: 0, name: "", color: "white" },
  })

  // The numbers on the dice, and how many times the user is allowed to move
  const dice = useRef<DiceType>({ dice1: 0, dice2: 0, moves: 0 })

  // The current checker color that is being moved
  const userChecker = useRef<types.UserCheckerType>()

  // If the checker has been picked up or not
  const checkerPicked = useRef(false)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef<number | undefined>()

  // All of the checkers' default positions
  const checkers = useRef<CheckerType[]>(null!)

  // The current phase of the game
  const [phase, setPhase] = useState<string>()

  // Game websocket
  const [ws, setWs] = useState<WebSocket>()

  // Boolean to keep track of if it's the user's turn or not
  const [myTurn, setMyTurn] = useState(true)

  // Audio to play when users switch
  const [audio] = useState(() => new Audio(userSwitch))

  // Load the models
  const { nodes, materials } = useGLTF(gltfModel) as GLTFResult

  // Plays the audio switching users
  const playAudio = () =>
    audio.play().catch(() => {
      console.log(
        "Error playing audio, since user hasn't interacted with the website."
      )
    })

  // User has potentially entered the game
  useEffect(() => {
    if (!inGame) return

    // If the game mode is pass and play
    if (gameMode.current === "pass-and-play") {
      setPhase("initial")
      userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
    }

    // If the game mode is a "live game"
    if (gameMode.current?.includes("game")) {
      const gameId = gameMode.current?.split("_")[1]

      // Starting a websocket connection to let the fun begin
      setWs(() => new WebSocket(`${getServerUrl(false)}/ws/game/${gameId}/`))
    }
  }, [inGame])

  // Connecting to the backend (live game)
  useEffect(() => {
    if (!ws) return

    // Requesting initial data
    ws.onopen = () => ws.send(JSON.stringify({ initial: true }))

    ws.onmessage = (e: MessageEvent) => {
      const data: types.GameDataTypes = JSON.parse(e.data)

      // If there are too many sessions active
      if (data.too_many_users) {
        notification(
          "Please continue this game on your other active session!",
          "error"
        )
        return
      }

      // If game has ended
      if (data.finished) {
        userChecker.current = data.winner!
        setPhase("ended")
        setWs(undefined)
        notification(`${toCapitalize(data.winner!)} is the winner!`)
        return
      }

      // If there is a message
      if (data.message) {
        notification(`${data.user} said ${data.message}`, "messsage")
        return
      }

      userChecker.current = data.turn!
      checkers.current = data.board!
      dice.current = data.dice!
      let turn = false

      // User is playing as white
      if (data.white === user?.user_id && userChecker.current === "white") {
        turn = true
      }
      // Player is playing as black
      else if (
        data.black === user?.user_id &&
        userChecker.current === "black"
      ) {
        turn = true
      }

      setMyTurn(turn)

      // Setting the phase to initial
      if (players.current && user && data.initial) {
        setPhase("initial")

        // Filling the players reference
        const myColor = data.white === user?.user_id ? "white" : "black"
        const enemyColor = myColor === "white" ? "black" : "white"

        players.current.me.id = user.user_id
        players.current.me.name = user.username
        players.current.me.color = myColor

        players.current.enemy.id =
          myColor === "white" ? data.black! : data.white!
        players.current.enemy.name =
          myColor === "white" ? data.black_name! : data.white_name!
        players.current.enemy.color = enemyColor

        return
      }

      if (dice.current.moves !== 0) {
        // Complicated state changes. Essentially making sure that
        // whether the user is spectating or playing, they get the
        // neweset updates from the backend. (aka, making sure
        // all the checker positions are updated)

        // User is spectating
        if (!turn) {
          setPhase((curr) => {
            return curr === "spectate" ? "spectating" : "spectate"
          })
        }
        // User is playing
        else {
          setPhase((curr) => {
            return curr === "checkerMove" ? "checkerMoveAgain" : "checkerMove"
          })
        }
        return
      }

      // Making sure there is a rerender in the checkers component
      // so that both user's boards get updated
      setPhase((curr) => {
        return curr === "diceRollAgain" ? "diceRoll" : "diceRollAgain"
      })
    }
  }, [ws])

  // Playing sound effect when the user changes (live game)
  useEffect(() => {
    if (!phase || phase === "initial") return
    playAudio()
  }, [myTurn])

  // Playing sound effect when the user changes (pass and play)
  useEffect(() => {
    if (
      gameMode.current === "pass-and-play" &&
      (phase === "diceRoll" || phase === "diceRollAgain")
    ) {
      playAudio()
    }
  }, [phase])

  // Game state values
  const value = {
    nodes,
    materials,
    players,
    dice,
    userChecker,
    myTurn,
    checkers,
    checkerPicked,
    newCheckerPosition,
    ws,
    phase,
    setPhase,
    toggleControls,
    resetOrbit,
    toggleZoom,
  }

  return (
    <GameState.Provider value={value}>
      <Stage />

      <Controls />

      <UI />

      <Columns />

      <Physics>
        {/* <Debug /> */}

        <Board />

        {inGame && <Dices />}
        {inGame && <Checkers />}
      </Physics>
    </GameState.Provider>
  )
}

useGLTF.preload(gltfModel)

export default Game
