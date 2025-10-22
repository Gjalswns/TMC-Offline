"use client"

import React, { useEffect, useState, memo } from "react"
import { useGameState } from "@/hooks/use-game-state"



export default function DisplayPage() {
  const { state, isHydrated } = useGameState()
  const [currentMode, setCurrentMode] = useState<"scoreboard" | "timer">("scoreboard")

  // 디버깅용 로그
  console.log("Display 상태:", {
    autoSwitch: state.autoSwitch,
    timerRunning: state.timerRunning,
    timerSeconds: state.timerSeconds,
    currentMode
  })

  useEffect(() => {
    // 1분 이하일 때는 강제로 타이머 모드
    if (state.timerRunning && state.timerSeconds <= 60) {
      setCurrentMode("timer")
      return
    }

    // 자동전환이 비활성화되어 있을 때만 displayMode를 따름
    if (!state.autoSwitch) {
      setCurrentMode(state.displayMode)
    }
  }, [state.displayMode, state.timerSeconds, state.timerRunning, state.autoSwitch])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state.autoSwitch) {
      console.log("자동 전환 시작됨", { autoSwitch: state.autoSwitch })

      interval = setInterval(() => {
        setCurrentMode((prev) => {
          const newMode = prev === "scoreboard" ? "timer" : "scoreboard"
          console.log(`화면 전환: ${prev} -> ${newMode}`)
          return newMode
        })
      }, 5000)
    } else {
      console.log("자동 전환 비활성화됨")
    }

    return () => {
      if (interval) {
        console.log("자동 전환 정리됨")
        clearInterval(interval)
      }
    }
  }, [state.autoSwitch])

  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score)
  const leftTeams = sortedTeams.slice(0, 5)
  const rightTeams = sortedTeams.slice(5, 10)

  const getRankStyle = (globalIndex: number) => {
    if (globalIndex === 0) {
      // 1st place - Gold
      return {
        cardClass:
          "backdrop-blur-xl bg-gradient-to-br from-yellow-500/30 to-amber-600/20 border-2 border-yellow-400/60 shadow-2xl shadow-yellow-500/50",
        badgeClass: "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/70",
        scoreClass: "text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]",
      }
    } else if (globalIndex === 1) {
      // 2nd place - Silver
      return {
        cardClass:
          "backdrop-blur-xl bg-gradient-to-br from-slate-300/25 to-slate-400/15 border-2 border-slate-300/50 shadow-2xl shadow-slate-300/40",
        badgeClass: "bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-400/70",
        scoreClass: "text-slate-200 drop-shadow-[0_0_20px_rgba(203,213,225,0.8)]",
      }
    } else if (globalIndex === 2) {
      // 3rd place - Bronze
      return {
        cardClass:
          "backdrop-blur-xl bg-gradient-to-br from-orange-600/25 to-amber-700/15 border-2 border-orange-400/50 shadow-2xl shadow-orange-500/40",
        badgeClass: "bg-gradient-to-br from-orange-500 to-amber-700 shadow-lg shadow-orange-500/70",
        scoreClass: "text-orange-300 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]",
      }
    }
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const timerProgress = (state.timerSeconds / state.timerDuration) * 100
  const circumference = 2 * Math.PI * 240
  const strokeDashoffset = circumference * (1 - timerProgress / 100)

  const getTimerColor = () => {
    if (timerProgress > 50) return "stroke-blue-500"
    if (timerProgress > 20) return "stroke-purple-500"
    return "stroke-red-500"
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-2xl">디스플레이 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 overflow-hidden relative">


      <div className="relative z-10">
        {currentMode === "scoreboard" ? (
          <div className="flex flex-col min-h-screen py-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">Scoreboard</h1>
              <div className="mt-2 text-lg text-white/70">
                {state.timerRunning ? (
                  <span>남은 시간: {formatTime(state.timerSeconds)}</span>
                ) : (
                  <span>타이머 정지됨 ({formatTime(state.timerSeconds)})</span>
                )}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-8 max-w-7xl w-full">
                {/* Left Column */}
                <div className="space-y-4 flex flex-col justify-center">
                  {leftTeams.map((team, index) => {
                    const globalIndex = index
                    const rankStyle = getRankStyle(globalIndex)

                    return (
                      <div
                        key={team.id}
                        className={
                          rankStyle
                            ? `${rankStyle.cardClass} rounded-2xl p-6`
                            : "backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
                        }
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between min-h-[80px]">
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={
                                rankStyle
                                  ? `${rankStyle.badgeClass} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`
                                  : "w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/50 animate-pulse flex-shrink-0"
                              }
                            >
                              {globalIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0 py-2">
                              <div className="text-2xl font-semibold text-white truncate leading-tight">{team.name}</div>
                              {team.members && <div className="text-sm text-gray-400 mt-1 truncate">{team.members}</div>}
                              <div className="flex gap-2 mt-2 text-xs text-gray-400">
                                <span>R1: {team.roundScores[0]}</span>
                                <span>R2: {team.roundScores[1]}</span>
                                <span>R3: {team.roundScores[2]}</span>
                                <span>R4: {team.roundScores[3]}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center flex-shrink-0 ml-4">
                            <span
                              className={
                                rankStyle
                                  ? `text-5xl font-bold ${rankStyle.scoreClass}`
                                  : "text-5xl font-bold text-blue-400 drop-shadow-lg drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                              }
                            >
                              {team.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-4 flex flex-col justify-center">
                  {rightTeams.map((team, index) => {
                    const globalIndex = index + 5
                    const rankStyle = getRankStyle(globalIndex)

                    return (
                      <div
                        key={team.id}
                        className={
                          rankStyle
                            ? `${rankStyle.cardClass} rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-in-right`
                            : "backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/20 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 animate-slide-in-right"
                        }
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between min-h-[80px]">
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={
                                rankStyle
                                  ? `${rankStyle.badgeClass} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`
                                  : "w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/50 animate-pulse flex-shrink-0"
                              }
                            >
                              {globalIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0 py-2">
                              <div className="text-2xl font-semibold text-white truncate leading-tight">{team.name}</div>
                              {team.members && <div className="text-sm text-gray-400 mt-1 truncate">{team.members}</div>}
                              <div className="flex gap-2 mt-2 text-xs text-gray-400">
                                <span>R1: {team.roundScores[0]}</span>
                                <span>R2: {team.roundScores[1]}</span>
                                <span>R3: {team.roundScores[2]}</span>
                                <span>R4: {team.roundScores[3]}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center flex-shrink-0 ml-4">
                            <span
                              className={
                                rankStyle
                                  ? `text-5xl font-bold ${rankStyle.scoreClass}`
                                  : "text-5xl font-bold text-purple-400 drop-shadow-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                              }
                            >
                              {team.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="relative inline-block">
                <svg className="w-[600px] h-[600px] transform -rotate-90">
                  {/* Background circle */}
                  <circle cx="300" cy="300" r="240" className="stroke-white/10" strokeWidth="24" fill="none" />
                  {/* Progress circle with enhanced glow */}
                  <circle
                    cx="300"
                    cy="300"
                    r="240"
                    className={`${getTimerColor()} transition-all duration-1000`}
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 30px currentColor) drop-shadow(0 0 60px currentColor)",
                    }}
                  />
                </svg>
                {/* Center content with title inside */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-full w-[420px] h-[420px] flex flex-col items-center justify-center shadow-2xl animate-pulse-glow">
                    <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">타이머</h1>
                    <span className="text-9xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] tracking-wider">
                      {formatTime(state.timerSeconds)}
                    </span>
                    <p className="text-2xl text-white mt-6 animate-pulse">
                      {state.timerRunning ? state.timerMessage || "진행 중" : "일시정지"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
