"use client"

import React, { useState, useEffect, useCallback } from "react"
import { type GameState, type Team, loadGameState, saveGameState, subscribeToGameState, defaultState, calculateCurrentTimerSeconds } from "@/lib/game-state"

export function useGameState() {
  const [state, setState] = useState<GameState>(defaultState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 클라이언트에서만 실제 데이터 로드
    setState(loadGameState())
    setIsHydrated(true)

    const unsubscribe = subscribeToGameState((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  // 서버 시간 기반 타이머 업데이트
  useEffect(() => {
    if (!state.timerRunning || !state.timerStartTime) return

    const interval = setInterval(() => {
      setState(prevState => {
        const currentSeconds = calculateCurrentTimerSeconds(prevState)
        if (currentSeconds <= 0) {
          // 타이머 종료
          const newState = {
            ...prevState,
            timerRunning: false,
            timerStartTime: undefined,
            timerSeconds: 0,
          }
          saveGameState(newState)
          return newState
        }
        
        // 타이머 업데이트 (저장하지 않음 - 서버 시간 기반이므로)
        return {
          ...prevState,
          timerSeconds: currentSeconds,
        }
      })
    }, 100) // 100ms마다 업데이트로 더 정확한 시간 표시

    return () => clearInterval(interval)
  }, [state.timerRunning, state.timerStartTime])

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates }
      saveGameState(newState)
      return newState
    })
  }, [])

  const updateTeam = useCallback((teamId: number, updates: Partial<Team>) => {
    setState((prev) => {
      const newState = {
        ...prev,
        teams: prev.teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                ...updates,
                roundScores: updates.roundScores || team.roundScores || [0, 0, 0],
              }
            : team,
        ),
      }
      saveGameState(newState)
      return newState
    })
  }, [])

  return { state, updateState, updateTeam, isHydrated }
}
