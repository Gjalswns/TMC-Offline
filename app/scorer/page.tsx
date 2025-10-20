"use client"

import React, { useState } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ScorerPage() {
  const { state, updateTeam, isHydrated } = useGameState()
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

  const selectedTeam = state.teams.find((t) => t.id === selectedTeamId)
  const currentRoundIndex = state.currentRound - 1

  const handleAddScore = () => {
    if (!selectedTeam) return

    const newRoundScores = [...selectedTeam.roundScores]
    newRoundScores[currentRoundIndex] = (newRoundScores[currentRoundIndex] || 0) + 10

    const newTotalScore = newRoundScores.reduce((sum, score) => sum + score, 0)

    updateTeam(selectedTeam.id, {
      roundScores: newRoundScores,
      score: newTotalScore,
    })
  }

  const handleSubtractScore = () => {
    if (!selectedTeam) return

    const newRoundScores = [...selectedTeam.roundScores]
    newRoundScores[currentRoundIndex] = Math.max(0, (newRoundScores[currentRoundIndex] || 0) - 10)

    const newTotalScore = newRoundScores.reduce((sum, score) => sum + score, 0)

    updateTeam(selectedTeam.id, {
      roundScores: newRoundScores,
      score: newTotalScore,
    })
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">점수 입력</h1>
          <p className="text-xl text-purple-300">라운드 {state.currentRound}</p>
        </div>

        {!selectedTeamId ? (
          <div className="space-y-3">
            <p className="text-white text-center mb-4 text-lg">팀을 선택하세요</p>
            {state.teams.map((team) => (
              <Button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                {team.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">{selectedTeam?.name}</h2>
                {selectedTeam?.members && <p className="text-lg text-gray-300">{selectedTeam.members}</p>}

                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-gray-400 mb-2">현재 라운드 점수</p>
                  <p className="text-6xl font-black text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                    {selectedTeam?.roundScores[currentRoundIndex] || 0}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-gray-400 mb-2">총점</p>
                  <p className="text-4xl font-bold text-purple-300">{selectedTeam?.score || 0}</p>
                </div>

                <div className="flex gap-2 text-sm text-gray-400 justify-center pt-2">
                  <span>R1: {selectedTeam?.roundScores[0] || 0}</span>
                  <span>R2: {selectedTeam?.roundScores[1] || 0}</span>
                  <span>R3: {selectedTeam?.roundScores[2] || 0}</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleSubtractScore}
                className="w-full h-32 text-5xl font-black bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-2xl shadow-red-500/50 active:scale-95 transition-transform"
              >
                -10
              </Button>
              <Button
                onClick={handleAddScore}
                className="w-full h-32 text-5xl font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/50 active:scale-95 transition-transform"
              >
                +10
              </Button>
            </div>

            <Button
              onClick={() => setSelectedTeamId(null)}
              variant="outline"
              className="w-full h-16 text-xl border-white/20 text-white hover:bg-white/10"
            >
              팀 변경
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
