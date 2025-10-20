"use client"

import React, { useRef, useState } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { startTimer, pauseTimer, resetTimer } from "@/lib/game-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, ExternalLink, Download, Upload, Lock } from "lucide-react"
import { gameStateToCSV, downloadCSV, parseCSVToTeams, generateFilename } from "@/lib/csv-utils"

export default function ControlPanel() {
  const { state, updateState, updateTeam, isHydrated } = useGameState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // 비밀번호 확인
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "0824") {
      setIsAuthenticated(true)
      setPasswordError("")
    } else {
      setPasswordError("잘못된 비밀번호입니다.")
      setPassword("")
    }
  }

  // 타이머 제어 함수들
  const handleTimerToggle = () => {
    if (state.timerRunning) {
      updateState(pauseTimer(state))
    } else {
      updateState(startTimer(state))
    }
  }

  const handleTimerReset = () => {
    updateState(resetTimer(300))
  }

  // CSV 내보내기
  const handleExportCSV = () => {
    const csvContent = gameStateToCSV(state)
    const filename = generateFilename()
    downloadCSV(csvContent, filename)
  }

  // CSV 가져오기
  const handleImportCSV = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvContent = e.target?.result as string
        const importedData = parseCSVToTeams(csvContent)
        if (importedData.teams) {
          updateState({ teams: importedData.teams })
        }
      }
      reader.readAsText(file)
    }
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const openDisplay = () => {
    window.open("/display", "_blank", "width=1920,height=1080")
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-gray-900 text-xl">관리 패널 로딩 중...</div>
      </div>
    )
  }

  // 비밀번호 입력 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 인증</h1>
            <p className="text-gray-600">관리 패널에 접근하려면 비밀번호를 입력하세요.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg tracking-widest"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 text-center">{passwordError}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              접근하기
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              비밀번호를 잊으셨나요? 관리자에게 문의하세요.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-semibold text-black">게임 관리 패널</h1>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} className="gap-2 !bg-white border border-gray-300 text-black hover:!bg-gray-50">
              <Download className="w-4 h-4" />
              CSV 내보내기
            </Button>
            <Button onClick={handleImportCSV} className="gap-2 !bg-white border border-gray-300 text-black hover:!bg-gray-50">
              <Upload className="w-4 h-4" />
              CSV 가져오기
            </Button>
            <Button onClick={openDisplay} className="gap-2 !bg-white border border-gray-300 text-black hover:!bg-gray-50">
              <ExternalLink className="w-4 h-4" />
              디스플레이 열기
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 !bg-white border border-gray-200 shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">팀 관리</h2>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-black">라운드:</Label>
                {[1, 2, 3].map((round) => (
                  <Button
                    key={round}
                    size="sm"
                    variant={state.currentRound === round ? "default" : "outline"}
                    onClick={() => updateState({ currentRound: round })}
                    className={`w-12 ${state.currentRound === round
                      ? "!bg-gray-900 hover:!bg-gray-800 text-white border-gray-900"
                      : "!bg-white border-gray-300 text-black hover:!bg-gray-50"
                      }`}
                  >
                    R{round}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.teams.map((team) => (
                <div key={team.id} className="flex flex-col gap-3 p-4 !bg-white rounded-lg border border-gray-200">
                  <Input
                    value={team.name}
                    onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                    placeholder="팀 이름"
                    className="!bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-black"
                  />
                  <Input
                    value={team.members || ""}
                    onChange={(e) => updateTeam(team.id, { members: e.target.value })}
                    placeholder="멤버 (예: 홍길동, 김철수)"
                    className="text-sm !bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-black"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newRoundScores = [...team.roundScores]
                        newRoundScores[state.currentRound - 1] = Math.max(0, newRoundScores[state.currentRound - 1] - 10)
                        const totalScore = newRoundScores.reduce((sum, score) => sum + score, 0)
                        updateTeam(team.id, { roundScores: newRoundScores, score: totalScore })
                      }}
                      className="w-12 !bg-white border-gray-300 text-black hover:!bg-gray-50"
                    >
                      -10
                    </Button>
                    <Input
                      type="number"
                      value={team.roundScores[state.currentRound - 1]}
                      onChange={(e) => {
                        const newRoundScores = [...team.roundScores]
                        newRoundScores[state.currentRound - 1] = Number.parseInt(e.target.value) || 0
                        const totalScore = newRoundScores.reduce((sum, score) => sum + score, 0)
                        updateTeam(team.id, { roundScores: newRoundScores, score: totalScore })
                      }}
                      className="flex-1 text-center !bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-black"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newRoundScores = [...team.roundScores]
                        newRoundScores[state.currentRound - 1] = newRoundScores[state.currentRound - 1] + 10
                        const totalScore = newRoundScores.reduce((sum, score) => sum + score, 0)
                        updateTeam(team.id, { roundScores: newRoundScores, score: totalScore })
                      }}
                      className="w-12 !bg-white border-gray-300 text-black hover:!bg-gray-50"
                    >
                      +10
                    </Button>
                  </div>
                  <div className="text-sm text-black text-center">
                    총점: <span className="font-semibold">{team.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 !bg-white border border-gray-200 shadow-none">
              <h2 className="text-xl font-semibold mb-4 text-black">타이머 제어</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-black">타이머 설정 (초)</Label>
                  <Input
                    type="number"
                    value={state.timerSeconds}
                    onChange={(e) => {
                      const seconds = Number.parseInt(e.target.value) || 0
                      updateState({
                        timerSeconds: seconds,
                        timerDuration: seconds,
                        timerRunning: false,
                        timerStartTime: undefined
                      })
                    }}
                    className="mt-2 !bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-black"
                  />
                  <p className="text-sm text-black font-medium mt-1">{formatTime(state.timerSeconds)}</p>
                </div>
                <div>
                  <Label className="text-black">타이머 메시지</Label>
                  <Input
                    value={state.timerMessage || "진행 중"}
                    onChange={(e) => updateState({ timerMessage: e.target.value })}
                    placeholder="진행 중"
                    className="mt-2 !bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-black"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleTimerToggle}
                    className={`flex-1 ${state.timerRunning
                      ? "!bg-white border border-red-300 text-red-700 hover:!bg-red-50"
                      : "!bg-white border border-green-300 text-green-700 hover:!bg-green-50"
                      }`}
                  >
                    {state.timerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {state.timerRunning ? "일시정지" : "시작"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTimerReset}
                    className="!bg-white border-gray-300 text-black hover:!bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 !bg-white border border-gray-200 shadow-none">
              <h2 className="text-xl font-semibold mb-4 text-black">디스플레이 설정</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-black">표시 모드</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={state.displayMode === "scoreboard" ? "default" : "outline"}
                      onClick={() => updateState({ displayMode: "scoreboard" })}
                      className={
                        state.displayMode === "scoreboard"
                          ? "!bg-gray-900 hover:!bg-gray-800 text-white border-gray-900"
                          : "!bg-white border-gray-300 text-black hover:!bg-gray-50"
                      }
                    >
                      점수판
                    </Button>
                    <Button
                      size="sm"
                      variant={state.displayMode === "timer" ? "default" : "outline"}
                      onClick={() => updateState({ displayMode: "timer" })}
                      className={
                        state.displayMode === "timer"
                          ? "!bg-gray-900 hover:!bg-gray-800 text-white border-gray-900"
                          : "!bg-white border-gray-300 text-black hover:!bg-gray-50"
                      }
                    >
                      타이머
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-switch" className="text-black">자동 전환</Label>
                  <Switch
                    id="auto-switch"
                    checked={state.autoSwitch}
                    onCheckedChange={(checked) => updateState({ autoSwitch: checked })}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
