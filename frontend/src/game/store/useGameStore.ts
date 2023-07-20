import { create } from "zustand"
import { GameStoreType } from "../types/gameStore.type"
import resign from "../utils/resign"
import { DEFAULT_CHECKER_POSITIONS, DEFAULT_SETTINGS, DEFAULT_SONG } from "../data/Data"
import { subscribeWithSelector } from "zustand/middleware"

export const useGameStore = create(
  subscribeWithSelector<GameStoreType>(() => ({
    // functions
    toggleControls: null,
    resetOrbit: null,
    resign,
    throwDice: null,
    setVolume: null,

    // States
    dice: { dice1: 0, dice2: 0, moves: 0 },
    dicePhysics: null,
    showThrow: null,

    checkers: JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)),
    userChecker: null,
    checkerPicked: null,
    newCheckerPosition: null,

    selectedSongs: [DEFAULT_SONG],
    songs: [],
    volume: 0.25,

    nodes: null,
    materials: null,

    gameMode: null,
    gameId: null,
    phase: undefined,
    inGame: false,
    players: null,
    winner: null,

    ws: null,
    timer: null,
    messages: null,
    initial: null,
    started: false,
    myTurn: true,
    settings: DEFAULT_SETTINGS,
  })),
)
