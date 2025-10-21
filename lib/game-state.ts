export interface Team {
  id: number
  name: string
  score: number
  members?: string
  roundScores: number[] // [R1, R2, R3, R4]
}

export interface GameState {
  teams: Team[]
  timerSeconds: number
  timerRunning: boolean
  timerStartTime?: number // 타이머 시작 시간 (timestamp)
  timerDuration: number // 원래 타이머 지속 시간
  displayMode: "scoreboard" | "timer"
  autoSwitch: boolean
  timerMessage?: string
  currentRound: number // 1, 2, 3, or 4
}

const STORAGE_KEY = "game-state"
const CHANNEL_NAME = "game-sync"

export const defaultState: GameState = {
  teams: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `팀 ${i + 1}`,
    score: 0,
    roundScores: [0, 0, 0, 0], // Initialize with 4 rounds
  })),
  timerSeconds: 300,
  timerRunning: false,
  timerStartTime: undefined,
  timerDuration: 300,
  displayMode: "scoreboard",
  autoSwitch: true,
  timerMessage: "진행 중",
  currentRound: 1, // Start at round 1
}

export function loadGameState(): GameState {
  if (typeof window === "undefined") return defaultState

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const loadedState = JSON.parse(stored)
      loadedState.teams = loadedState.teams.map((team: Team) => {
        // 기존 3라운드 데이터를 4라운드로 마이그레이션
        let roundScores = team.roundScores || [0, 0, 0, 0]
        if (roundScores.length === 3) {
          roundScores = [...roundScores, 0] // 4번째 라운드 추가
        }
        return {
          ...team,
          roundScores,
        }
      })
      if (!loadedState.currentRound) {
        loadedState.currentRound = 1
      }
      if (!loadedState.timerDuration) {
        loadedState.timerDuration = loadedState.timerSeconds || 300
      }
      return loadedState
    }
  } catch (e) {
    console.error("Failed to load game state:", e)
  }

  return defaultState
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.postMessage(state)
    channel.close()
  } catch (e) {
    console.error("Failed to save game state:", e)
  }
}

export function subscribeToGameState(callback: (state: GameState) => void): () => void {
  if (typeof window === "undefined") return () => {}

  const channel = new BroadcastChannel(CHANNEL_NAME)

  channel.onmessage = (event) => {
    callback(event.data)
  }

  return () => {
    channel.close()
  }
}

// 서버 시간 기반으로 현재 타이머 시간 계산
export function calculateCurrentTimerSeconds(state: GameState): number {
  if (!state.timerRunning || !state.timerStartTime) {
    return state.timerSeconds
  }

  const now = Date.now()
  const elapsed = Math.floor((now - state.timerStartTime) / 1000)
  const remaining = Math.max(0, state.timerDuration - elapsed)
  
  return remaining
}

// 타이머 시작
export function startTimer(state: GameState): Partial<GameState> {
  const now = Date.now()
  return {
    timerRunning: true,
    timerStartTime: now,
    timerDuration: state.timerSeconds,
  }
}

// 타이머 일시정지
export function pauseTimer(state: GameState): Partial<GameState> {
  const currentSeconds = calculateCurrentTimerSeconds(state)
  return {
    timerRunning: false,
    timerStartTime: undefined,
    timerSeconds: currentSeconds,
    timerDuration: currentSeconds,
  }
}

// 타이머 리셋
export function resetTimer(seconds: number = 300): Partial<GameState> {
  return {
    timerRunning: false,
    timerStartTime: undefined,
    timerSeconds: seconds,
    timerDuration: seconds,
  }
}
