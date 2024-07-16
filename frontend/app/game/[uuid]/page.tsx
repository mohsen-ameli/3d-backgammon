"use client"

import AxiosInstance from "@/components/utils/AxiosInstance"
import notification from "@/components/utils/Notification"
import toCapitalize from "@/components/utils/ToCapitalize"
import getServerUrl from "@/components/utils/getServerUrl"
import { useGameStore } from "@/game/store/useGameStore"
import { GameDataTypes } from "@/game/types/Game.type"
import switchPlayers from "@/game/utils/SwitchPlayers"
import { getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type DataType = { data: { valid: boolean; finished: boolean } }

/**
 * A game between two friends.
 */
export default function FriendGame({ params }: { params: { uuid: string } }) {
  // Lock camera on the board
  useGameStore.subscribe(
    state => state.resetOrbit,
    resetOrbit => {
      resetOrbit?.("board", true)
    },
  )

  const router = useRouter()
  const [fetched, setFetched] = useState(false)

  // Setting websocket listeners
  useGameStore.subscribe(
    state => state.ws,
    ws => {
      if (!ws) return

      ws.onopen = () => ws.send(JSON.stringify({ initial: true }))
      ws.onmessage = onMessage
    },
  )

  useEffect(() => {
    useGameStore.getState().resetOrbit?.("board", true)
    fetchStuff()

    return () => {
      useGameStore.setState({
        inGame: false,
        gameMode: undefined,
        gameId: null,
      })

      useGameStore.getState().resetOrbit?.("env")
    }
  }, [])

  // Backend has sent game updates
  async function onMessage(e: MessageEvent) {
    const session = await getSession()
    const data: GameDataTypes = JSON.parse(e.data)
    const id = Number(session?.user.id)

    if (data.error) {
      notification(data.error, "error", true)
      return
    }

    // If there are too many sessions active
    // if (data.too_many_users) {
    // const errorMsg = "Please continue this game on your other active session!"
    // notification(errorMsg, "error")
    // return
    // }

    // If game has ended
    if (data.finished) {
      // Showing a notification of the winner
      if (data.resigner) {
        setTimeout(() => {
          notification(`${toCapitalize(data.resigner?.name!)} has resigned the game.`)
        }, 500)
      }

      // TODO: Maybe add some confetti?

      // Cleaning
      useGameStore.setState({
        winner: data.winner,
        dice: { dice1: 0, dice2: 0, moves: 0 },
        userChecker: undefined,
        phase: "ended",
        ws: undefined,
        inGame: false,
      })

      useGameStore.getState().resetOrbit?.("env")

      return
    }

    // If there is a chat message
    if (data.message) {
      useGameStore.setState({
        messages: { userId: data.id!, message: data.message },
      })
      return
    }

    // If there are dice physics info
    // There are two ways to this. Either the user who is spectating is getting the other user's dice physic info,
    // or it's the current user, who's getting it. If it's the current user, then return immediately,
    if (data.physics) {
      if (id === data.physics.user.id) return

      // Throw the dice for the other user
      useGameStore.setState({ phase: "diceSync", dicePhysics: data.physics })
      return
    }

    useGameStore.setState({
      userChecker: data.turn,
      checkers: data.board,
      dice: data.dice,
      timer: data.player_timer,
    })

    // Settings user turn
    let myTurn = false
    const userChecker = useGameStore.getState().userChecker

    if ((data.white === id && userChecker === "white") || (data.black === id && userChecker === "black")) {
      myTurn = true
    }

    useGameStore.setState({ myTurn })

    // Setting the phase to initial
    if (data.initial) {
      const dice = useGameStore.getState().dice

      // If user has, for some reason, thrown the dice, then maybe left the page
      // and the dice numbers weren't detected in time, and then they come back
      // then we want to throw the dice for them
      if (
        data.initial_physics &&
        Object.keys(data.initial_physics).length !== 0 &&
        data.initial_physics.user.id === id &&
        myTurn &&
        dice.moves === 0
      ) {
        useGameStore.setState({
          phase: "diceRollPhysics",
          dicePhysics: data.initial_physics,
        })
      } else {
        useGameStore.setState({ phase: "initial" })
      }

      // Filling the players reference
      const myColor = data.white === Number(session?.user?.id) ? "white" : "black"

      useGameStore.setState({
        players: {
          me: {
            id,
            name: session?.user.name!,
            image: myColor === "white" ? data.white_image! : data.black_image!,
            color: myColor,
          },
          enemy: {
            id: myColor === "white" ? data.black! : data.white!,
            name: myColor === "white" ? data.black_name! : data.white_name!,
            image: myColor === "white" ? data.black_image! : data.white_image!,
            color: switchPlayers(myColor),
          },
        },
      })

      return
    }

    // if user is playing or spectating
    if (useGameStore.getState().dice?.moves !== 0) {
      // Complicated state changes. Essentially making sure that
      // whether the user is spectating or playing, they get the
      // newest updates from the backend. (aka, making sure
      // all the checker positions are updated)

      if (!myTurn)
        useGameStore.setState(curr => ({
          phase: curr.phase === "spectate" ? "spectating" : "spectate",
        }))
      else
        useGameStore.setState(curr => ({
          phase: curr.phase === "checkerMove" ? "checkerMoveAgain" : "checkerMove",
        }))

      return
    }

    // Making sure there is a rerender in the checkers component so that both user's boards get updated
    useGameStore.setState(curr => ({
      phase: curr.phase === "diceRollAgain" ? "diceRoll" : "diceRollAgain",
    }))
  }

  async function fetchStuff() {
    if (fetched) return

    const session = await getSession()
    const axiosInstance = AxiosInstance(session!)
    const { data }: DataType = await axiosInstance.get(`/api/game/valid-match/${params.uuid}/`)

    if (!data.valid) {
      router.push("/friends")
      notification("Wrong game :(", "error")
    } else if (data.finished) {
      router.push("/friends")
      notification("This game is finished :(", "error")
    } else {
      const url = `${getServerUrl(false)}/ws/game/${params.uuid}/`

      useGameStore.setState({
        inGame: true,
        gameMode: "friend-game",
        gameId: params.uuid,
        ws: new WebSocket(url),
      })
    }

    setFetched(true)
  }

  return <></>
}
