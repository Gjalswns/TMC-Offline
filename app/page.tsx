"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Monitor, Plus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">게임 관리 시스템</h1>
          <p className="text-xl text-gray-600">실시간 게임 점수 관리 및 디스플레이</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 관리자 페이지 */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-blue-200 hover:border-blue-400">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-800">관리자 패널</CardTitle>
              <CardDescription className="text-gray-600">
                팀 관리, 점수 설정, 타이머 제어
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                  관리자 페이지 열기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 디스플레이 페이지 */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 hover:border-purple-400">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-800">디스플레이</CardTitle>
              <CardDescription className="text-gray-600">
                점수판 및 타이머 화면 표시
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/display" target="_blank">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg">
                  디스플레이 열기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 점수 입력 페이지 */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-green-200 hover:border-green-400">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">점수 입력</CardTitle>
              <CardDescription className="text-gray-600">
                모바일 친화적 점수 입력 화면
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/scorer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  점수 입력 페이지 열기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">사용 방법</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. <strong>관리자 패널</strong>에서 팀 정보와 게임 설정을 관리하세요</p>
              <p>2. <strong>디스플레이</strong>를 별도 화면에 띄워 관중들에게 보여주세요</p>
              <p>3. <strong>점수 입력</strong> 페이지로 실시간으로 점수를 업데이트하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}