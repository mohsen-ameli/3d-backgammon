import * as data from "../data/Data"

// This will reset the dices positions
const resetDices = (dices) => {
  dices[0].setTranslation({
    x: data.DICE_1_DEFAULT_POS[0],
    y: data.DICE_1_DEFAULT_POS[1],
    z: data.DICE_1_DEFAULT_POS[2],
  })
  dices[1].setTranslation({
    x: data.DICE_2_DEFAULT_POS[0],
    y: data.DICE_2_DEFAULT_POS[1],
    z: data.DICE_2_DEFAULT_POS[2],
  })
}

export default resetDices
