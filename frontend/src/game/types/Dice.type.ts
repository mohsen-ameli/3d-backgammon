export type finishedThrowType = {
  0: boolean
  1: boolean
}

export type DiceType = { dice1: number; dice2: number; moves: number }

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

export type DicePhysics = {
  id: number
  physics: {
    die1: DiePhysics
    die2: DiePhysics
  }
}
