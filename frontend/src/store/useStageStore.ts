import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export type Stage =
  | "pro-noob"
  | "single-player"
  | "throw-dice"
  | "dice-numbers"
  | "player-color"
  | "how-to-move"
  | "move"
  | "final"

export const stages: Stage[] = [
  "pro-noob",
  "single-player",
  "throw-dice",
  "dice-numbers",
  "player-color",
  "how-to-move",
  "move",
  "final",
]

type StageStore = { stage: Stage; nextStage: () => void; prevStage: () => void }

export const useStageStore = create(
  subscribeWithSelector<StageStore>(set => ({
    stage: "pro-noob",
    // Goes to the next stage
    nextStage: () =>
      set(state => ({
        stage: state.stage === "final" ? state.stage : stages[stages.indexOf(state.stage) + 1],
      })),
    // Goes to the previous stage
    prevStage: () =>
      set(state => ({
        stage: state.stage === "pro-noob" ? state.stage : stages[stages.indexOf(state.stage) - 1],
      })),
  })),
)
