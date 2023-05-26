import { PlayerType } from "./Game.type"

export type DiceReadyType = {
  dice1: boolean
  dice2: boolean
}

export type DiceMoveType = {
  dice1: number
  dice2: number
  moves: number
}

// The physics of a die, that gets thrown
export type DiePhysics = {
  impulse: {
    x: number
    y: number
    z: number
  }
  torque: {
    x: number
    y: number
    z: number
  }
}

// Physics of both dice
export type DicePhysics = {
  user: PlayerType
  physics: {
    die1: DiePhysics
    die2: DiePhysics
  }
}
