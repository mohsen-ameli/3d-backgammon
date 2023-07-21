import { a as a3f, useSpring } from "@react-spring/three"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useDrag } from "@use-gesture/react"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Plane, Vector3 } from "three"
import { BOARD_W, CHECKER_W, GROUND_CHECKERS } from "../data/Data"
import { CheckerType } from "../types/Checker.type"
import Endgame from "../utils/Endgame"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import gameWon from "./utils/GameWon"
import getCheckerPos from "./utils/GetCheckerPos"
import ValidateMove from "./utils/ValidateMove"
import { useGameStore } from "../store/useGameStore"
import { shallow } from "zustand/shallow"
import getCheckersOnCol from "../utils/getCheckersOnCol"
import sortCheckers from "./utils/SortCheckers"
import updateGameWinner from "./utils/UpdateGameWinner"
import updateStuff from "./utils/UpdateStuff"

type PosType = [number, number, number] | Vector3 | number[]

const planeIntersectPoint = new Vector3()

const floorPlane = new Plane(new Vector3(0, 1, 0), 0)

const bindOptions = { eventOptions: { capture: false, passive: true } }

/**
 * A single checker. This is where the magic takes place.
 * Most of the game logic is implemented here.
 */
export default function Checker({ id, setShow }: { id: number; setShow: Dispatch<SetStateAction<boolean>> }) {
  const thisChecker = useGameStore(state => state.checkers[id], shallow)
  const nodes = useMemo(() => useGameStore.getState().nodes, [])
  const materials = useMemo(() => useGameStore.getState().materials, [])
  const toggleControls = useGameStore.getState().toggleControls!
  const initial = useGameStore(state => state.initial, shallow)

  // This checker's rigid body instance
  const checker = useRef<RigidBodyApi>(null!)

  // To cause a rerender of this checker (for animations)
  const [rerender, setRerender] = useState(false)

  // Checker's position
  const [pos] = useState<PosType>([
    -(BOARD_W + (CHECKER_W * 5.6) / 4) - 0.01,
    GROUND_CHECKERS + 0.15,
    thisChecker.color === "white" ? 0.22 + 0.04 * (thisChecker.id + 1) : 0.38 - 0.04 * (thisChecker.id + 1),
  ])

  // Spring animation for dragging
  const [spring, springApi] = useSpring(() => ({
    rotation: [-3, -4].includes(thisChecker.col) || !initial?.doneLoading ? [Math.PI / 3, 0, 0] : [0, 0, 0],
    position: pos,
    config: { mass: 1, friction: 28, tension: 400 },
  }))

  /**
   * Showing an animation when the checkers first load in
   */
  useEffect(() => {
    // If we are not done loading, meaning the camera is still coming on top of the board, then return
    if (!initial || !initial.doneLoading) return

    // New position and rotation for the this checker
    const position = getCheckerPos(thisChecker)
    const rotation = [-3, -4].includes(thisChecker.col) ? [Math.PI / 3, 0, 0] : [0, 0, 0]

    async function animate() {
      const x = thisChecker.id + 1

      await new Promise(resolve => setTimeout(resolve, 200 * x))

      springApi.start({
        // @ts-ignore
        position: [pos[0], 0.05, pos[2]],
        rotation: [0, 0, 0],
      })

      await new Promise(resolve => setTimeout(resolve, 10 * x))

      springApi.start({ position, rotation })

      checker.current?.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      })
    }

    animate()
  }, [initial])

  /**
   * Subscribe to this checker's state and update its position and rotation, whenever it changes
   */
  useEffect(() => {
    // If the checkers have just been loaded, return so that the entering animation can be played.
    if (!initial || initial.initialLoad) return

    // New position and rotation for the checker
    const position = getCheckerPos(thisChecker)
    const rotation = [-3, -4].includes(thisChecker.col) ? [Math.PI / 3, 0, 0] : [0, 0, 0]

    // Setting checker's mesh position
    springApi.start({ position, rotation })

    // Setting the checker's physics position
    checker.current?.setTranslation({
      x: position[0],
      y: position[1],
      z: position[2],
    })
  }, [thisChecker.col, thisChecker.row, thisChecker.removed, rerender])

  /**
   * Goes back to the original position of the checker
   */
  const goToOriginalPos = useCallback((currentChecker: CheckerType) => {
    const position = getCheckerPos(currentChecker)
    springApi.start({ position })
  }, [])

  /**
   * When a checker is picked up (dragged) and released
   * This is where the main logic for the game is
   */
  const bind = useDrag(({ active, event, dragging, cancel }) => {
    const { dice, userChecker, phase, gameMode, players } = useGameStore.getState()

    // Check to see if the user is allowed to move
    if (
      !["checkerMoveAgain", "checkerMove"].includes(phase ?? "") ||
      dice.moves === 0 ||
      thisChecker.color !== userChecker ||
      [-3, -4].includes(thisChecker.col) ||
      (gameMode === "vs-computer" && players?.enemy.color === userChecker)
    )
      return

    const checkerPicked = useGameStore.getState().checkerPicked!
    const newCheckerPosition = useGameStore.getState().newCheckerPosition!

    if (active) {
      // @ts-ignore
      event.ray.intersectPlane(floorPlane, planeIntersectPoint)
      springApi.start({ position: [planeIntersectPoint.x, 0, planeIntersectPoint.z] })
    }

    // User started dragging the checker
    if (dragging) {
      // If the user is dragging multiple checkers, then stop the drag
      if (checkerPicked && checkerPicked.id !== thisChecker.id) {
        cancel()
        return
      } else {
        useGameStore.setState({ checkerPicked: thisChecker })
      }

      toggleControls("checkerDisable")
      return
    }

    toggleControls("checkerEnable")
    useGameStore.setState({ checkerPicked: null })

    // From, to, and moved column numbers
    const to = newCheckerPosition as number
    let from: number
    let moved: number

    if (thisChecker.col === -1) from = -1
    else if (thisChecker.col === -2) from = 24
    else from = thisChecker.col

    if (to === -3) moved = 24 - from
    else if (to === -4) moved = from + 1
    else moved = thisChecker.color === "white" ? to - from : from - to

    /**
     * User is trying to bear off their checker
     */
    if ([-3, -4].includes(to)) {
      // If user is in an endgame
      if (!Endgame(userChecker)) return

      // Validating the move
      if (!ValidateMove(thisChecker, moved)) {
        goToOriginalPos(thisChecker)
        return
      }

      const checkers = useGameStore.getState().checkers
      const checkersOnEndCol = checkers.filter(checker => checker.col === to)
      const checker_ = {
        col: to,
        row: checkersOnEndCol.length,
        removed: false,
      } as CheckerType
      const positions = getCheckerPos(checker_)

      // Saving the new position of the checker
      thisChecker.col = to
      thisChecker.row = checkersOnEndCol.length
      thisChecker.removed = false

      // Updating state
      useGameStore.setState(curr => ({
        checkers: curr.checkers.map(checker => (checker.id === thisChecker.id ? { ...thisChecker } : checker)),
      }))

      // Sorting the checkers
      sortCheckers(from)

      setRerender(prev => !prev)

      // Checking if user has won
      const possibleWinner = userChecker

      if (!gameWon(possibleWinner)) {
        updateStuff(moved, setShow)
        return
      }

      /**
       * !! User has won the game wohoo !!
       */
      const ws = useGameStore.getState().ws
      if (ws) {
        updateGameWinner(ws)
        return
      }
      useGameStore.setState({ phase: "ended", userChecker: possibleWinner, inGame: false })
      springApi.start({ position: positions, rotation: [Math.PI / 3, 0, 0] })

      return
    }

    /**
     * User is trying to move to a column within the board
     */
    const { action, numCheckers, rmChecker } = getCheckersOnCol(to, thisChecker.color)
    const removedCheckersLen = lenRemovedCheckers(userChecker)

    // If user is moving wrongly, move them back to their original position
    if (
      action === "invalid" ||
      isNaN(moved) ||
      moved <= 0 ||
      ![dice.dice1, dice.dice2].includes(moved) ||
      (removedCheckersLen <= 0 && thisChecker.removed) ||
      (removedCheckersLen !== 0 && !thisChecker.removed)
    ) {
      goToOriginalPos(thisChecker)
      return
    }

    /**
     * User is making a valid move. Nice..
     */
    if (action === "remove" && rmChecker) {
      // Updating removed checker
      rmChecker.col = rmChecker.color === "white" ? -1 : -2
      rmChecker.row = lenRemovedCheckers(rmChecker.color)
      rmChecker.removed = true
    }

    // Updating this checker
    thisChecker.col = to
    thisChecker.row = action === "remove" ? numCheckers - 1 : numCheckers
    thisChecker.removed = false

    // Updating state
    useGameStore.setState(curr => ({
      checkers: curr.checkers.map(checker =>
        checker.id === thisChecker.id ? { ...thisChecker } : checker.id === rmChecker?.id ? { ...rmChecker } : checker,
      ),
    }))

    // Sorting the checkers
    sortCheckers(from)

    // Update states and backend
    updateStuff(moved, setShow)

    setRerender(prev => !prev)

    // End of logic... phew!
    return
  }, bindOptions)

  if (!nodes || !materials) return <></>

  return (
    <>
      <RigidBody ref={checker} type="kinematicPosition">
        <CuboidCollider args={[0.08, 0.015, 0.08]} position={[0, 0.015, 0]} />
      </RigidBody>

      {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
      <a3f.group
        {...spring}
        onPointerOver={e => {
          e.stopPropagation()
          document.body.style.cursor = "grab"
        }}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        {/* Invisible box surrounding the checkers so the user can easily drag each checker */}
        {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
        <a3f.mesh {...bind()}>
          <boxGeometry args={[0.3, 0.06, 0.2]} />
          <meshNormalMaterial visible={false} />
        </a3f.mesh>

        <a3f.mesh
          name="WhiteChecker"
          castShadow
          geometry={nodes.WhiteChecker.geometry}
          material={thisChecker.color === "white" ? materials.WhiteCheckerMat : materials.DarkCheckerMat}
        />
      </a3f.group>
    </>
  )
}
