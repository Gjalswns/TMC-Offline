import { GameState, Team } from './game-state'

// GameState를 CSV 형식으로 변환
export function gameStateToCSV(state: GameState): string {
  const headers = [
    'Team ID',
    'Team Name', 
    'Members',
    'Round 1 Score',
    'Round 2 Score', 
    'Round 3 Score',
    'Round 4 Score',
    'Total Score'
  ]
  
  const rows = state.teams.map(team => [
    team.id.toString(),
    `"${team.name}"`, // 쉼표가 포함될 수 있으므로 따옴표로 감싸기
    `"${team.members || ''}"`,
    team.roundScores[0]?.toString() || '0',
    team.roundScores[1]?.toString() || '0', 
    team.roundScores[2]?.toString() || '0',
    team.roundScores[3]?.toString() || '0',
    team.score.toString()
  ])
  
  // 게임 설정 정보도 추가
  const gameInfo = [
    [''],
    ['Game Settings'],
    ['Current Round', state.currentRound.toString()],
    ['Timer Seconds', state.timerSeconds.toString()],
    ['Timer Running', state.timerRunning.toString()],
    ['Display Mode', state.displayMode],
    ['Auto Switch', state.autoSwitch.toString()],
    ['Timer Message', `"${state.timerMessage || ''}"`],
    ['Export Date', new Date().toISOString()]
  ]
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    ...gameInfo.map(row => row.join(','))
  ].join('\n')
  
  return csvContent
}

// CSV를 다운로드하는 함수
export function downloadCSV(csvContent: string, filename: string = 'game-data.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// CSV 파일을 읽어서 GameState로 변환 (기본적인 팀 데이터만)
export function parseCSVToTeams(csvContent: string): Partial<GameState> {
  const lines = csvContent.split('\n')
  const teams: Team[] = []
  
  // 헤더 라인 건너뛰기
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('Game Settings') || line === '') break
    
    const columns = parseCSVLine(line)
    if (columns.length >= 7) {
      // 기존 3라운드 형식과 새로운 4라운드 형식 모두 지원
      const isOldFormat = columns.length === 7
      const team: Team = {
        id: parseInt(columns[0]) || i,
        name: columns[1].replace(/"/g, ''),
        members: columns[2].replace(/"/g, ''),
        roundScores: isOldFormat ? [
          parseInt(columns[3]) || 0,
          parseInt(columns[4]) || 0,
          parseInt(columns[5]) || 0,
          0 // 4번째 라운드는 0으로 초기화
        ] : [
          parseInt(columns[3]) || 0,
          parseInt(columns[4]) || 0,
          parseInt(columns[5]) || 0,
          parseInt(columns[6]) || 0
        ],
        score: parseInt(columns[isOldFormat ? 6 : 7]) || 0
      }
      teams.push(team)
    }
  }
  
  return { teams }
}

// CSV 라인을 파싱하는 헬퍼 함수 (따옴표 처리)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

// 현재 날짜/시간으로 파일명 생성
export function generateFilename(): string {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
  return `game-data-${dateStr}-${timeStr}.csv`
}