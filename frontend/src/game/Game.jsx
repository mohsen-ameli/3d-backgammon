import { useGLTF, Environment } from "@react-three/drei"
import { createContext, useContext, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Physics } from "@react-three/rapier"
import Dices from "./Dices"
import UI from "./UI"
import Checkers from "./Checkers"
import Board from "./Board"
import Columns from "./Columns"
import { useEffect } from "react"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { AuthContext } from "../context/AuthContext"
import notification from "../components/utils/Notification"
import toCapitalize from "../components/utils/ToCapitalize"
import Controls from "./Controls"
import userSwitch from "../assets/sounds/user-switch.mp3"
import getServerUrl from "../components/utils/getServerUrl"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  const { user, inGame, gameMode } = useContext(AuthContext)

  // Orbit control functions. These are defined in the Controls component
  const resetOrbit = useRef(() => null)
  const toggleControls = useRef(() => null)
  const toggleZoom = useRef(() => null)
  const orbitRef = useRef()

  // Current players (Only set in a live game)
  const players = useRef({
    me: { name: "", color: "" },
    enemy: { name: "", color: "" },
  })

  // The numbers on the dice, and how many times the user is allowed to move
  // ex: {dice1: 2, dice2: 5, moves: 2} -> The dice shows 2 and 5, therefore the user can move twice
  // ex: {dice1: 6, dice2: 6, moves: 4} -> The dice shows 6 and 6, therefore the user can move four times
  const dice = useRef({ dice1: 0, dice2: 0, moves: 0 })

  // The current checker color that is being moved
  const userChecker = useRef()

  // If the checker has been picked up or not
  const checkerPicked = useRef(false)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef()

  /* checkers: [
    id: int,
    color: "white" | "black",
    col: int = 0-23 normal | -1 removed white checker | -2 removed black checker | -3 endbar white checker | -4 endbar black checker,
    row: int = 0 - 4,
    removed: boolean
  ] */

  // All of the checkers' default positions
  const checkers = useRef([])

  // The current phase of the game
  const [phase, setPhase] = useState()

  // Game websocket
  const [ws, setWs] = useState(() => {})

  // Boolean to keep track of if it's the user's turn or not
  const [myTurn, setMyTurn] = useState(true)

  // Audio to play when users switch
  const [audio] = useState(() => new Audio(userSwitch))
  const playAudio = () =>
    audio.play().catch(() => {
      console.log(
        "Error playing audio, since user hasn't interacted with the website."
      )
    })

  // Load the models
  const { nodes, materials } = useGLTF(models)

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
    if (gameMode.current.includes("game")) {
      const gameId = gameMode.current.split("_")[1]

      // Starting a websocket connection to let the fun begin
      setWs(() => new WebSocket(`${getServerUrl(false)}/ws/game/${gameId}/`))
    }
  }, [inGame])

  // Connecting to the backend (live game)
  useEffect(() => {
    if (!ws) return

    // Requesting initial data
    ws.onopen = () => ws.send(JSON.stringify({ initial: true }))

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      // If there are too many sessions active
      if (data["too_many_users"]) {
        notification(
          "Please continue this game on your other active session!",
          "error"
        )
        return
      }

      // If game has ended
      if (data["finished"]) {
        userChecker.current = data["winner"]
        setPhase("ended")
        notification(`${toCapitalize(data["winner"])} is the winner!`)
        return
      }

      // If there is a message
      if (data["message"]) {
        notification(`${data["user"]} said ${data["message"]}`, "messsage")
        return
      }

      userChecker.current = data["turn"]
      checkers.current = data["board"]
      dice.current = data["dice"]
      let turn = false

      // User is playing as white
      if (data.white === user.user_id && userChecker.current === "white") {
        turn = true
      }
      // Player is playing as black
      else if (data.black === user.user_id && userChecker.current === "black") {
        turn = true
      }

      setMyTurn(turn)

      // Setting the phase to initial
      if (data.initial) {
        setPhase("initial")

        // Filling the players reference
        const myColor = data.white === user.user_id ? "white" : "black"
        const enemyColor = myColor === "white" ? "black" : "white"

        players.current.me.id = user.user_id
        players.current.me.name = user.username
        players.current.me.color = myColor

        players.current.enemy.id =
          myColor === "white" ? data["black"] : data["white"]
        players.current.enemy.name =
          myColor === "white" ? data["black-name"] : data["white-name"]
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
    <>
      <Environment preset="forest" background blur={0.1} />

      <ambientLight intensity={1} />
      <directionalLight position={[-5, 10, 5]} intensity={0.5} />

      {/* <Perf position="top-left" /> */}

      <GameState.Provider value={value}>
        <Controls ref={orbitRef} />

        <UI />

        <Columns />

        <Physics>
          {/* <Debug /> */}

          <Board />

          {inGame && <Dices />}
          {inGame && <Checkers />}
        </Physics>
      </GameState.Provider>
    </>
  )
}

useGLTF.preload(models)

export default Game
