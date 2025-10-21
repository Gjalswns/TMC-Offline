# 데이터 저장 방식

## 📍 저장 위치

이 게임 관리 시스템의 데이터는 **브라우저의 localStorage**에 저장됩니다.

### 저장 키
- **키 이름**: `"game-state"`
- **저장 형식**: JSON 문자열

## 🗂️ 저장되는 데이터

```typescript
interface GameState {
  teams: Team[]              // 팀 정보 (이름, 점수, 멤버)
  timerSeconds: number       // 현재 타이머 시간
  timerRunning: boolean      // 타이머 실행 상태
  timerStartTime?: number    // 타이머 시작 시간 (timestamp)
  timerDuration: number      // 타이머 지속 시간
  displayMode: string        // 디스플레이 모드 ("scoreboard" | "timer")
  autoSwitch: boolean        // 자동 전환 설정
  timerMessage?: string      // 타이머 메시지
  currentRound: number       // 현재 라운드 (1, 2, 3, 4)
}
```

## 💾 저장 위치 상세

### Windows
```
C:\Users\[사용자명]\AppData\Local\[브라우저]\User Data\Default\Local Storage\leveldb\
```

### Mac
```
~/Library/Application Support/[브라우저]/Default/Local Storage/leveldb/
```

### Linux
```
~/.config/[브라우저]/Default/Local Storage/leveldb/
```

## 🔄 실시간 동기화

### BroadcastChannel API 사용
- **채널 이름**: `"game-sync"`
- **목적**: 같은 브라우저의 여러 탭 간 실시간 데이터 동기화
- **범위**: 같은 도메인의 탭들만 동기화

## ⚠️ 중요 사항

### 데이터 지속성
- ✅ **브라우저를 닫아도 데이터 유지**
- ✅ **컴퓨터를 재시작해도 데이터 유지**
- ❌ **브라우저 데이터 삭제 시 모든 데이터 손실**
- ❌ **다른 브라우저에서는 데이터 공유 안됨**

### 데이터 손실 위험 상황
1. 브라우저 캐시/쿠키 삭제
2. 브라우저 개인정보 보호 모드 사용
3. 브라우저 설정에서 localStorage 비활성화
4. 시크릿/프라이빗 모드에서 사용

## 🛡️ 데이터 백업 방법

### CSV 파일 백업 (권장)
관리자 페이지에서:
1. **"CSV 내보내기"** 버튼 클릭
2. 자동으로 `game-data-YYYY-MM-DD-HH-MM-SS.csv` 파일 다운로드
3. 안전한 위치에 파일 저장

### CSV 파일 복원
관리자 페이지에서:
1. **"CSV 가져오기"** 버튼 클릭
2. 백업한 CSV 파일 선택
3. 팀 데이터 자동 복원

### 수동 백업 (고급 사용자)
브라우저 개발자 도구에서:
```javascript
// 데이터 내보내기
const gameData = localStorage.getItem('game-state');
console.log(gameData); // 이 값을 복사해서 저장

// 데이터 가져오기
localStorage.setItem('game-state', '복사한_JSON_데이터');
```

### CSV 파일 형식
```csv
Team ID,Team Name,Members,Round 1 Score,Round 2 Score,Round 3 Score,Round 4 Score,Total Score
1,"팀 1","홍길동, 김철수",10,20,30,15,75
2,"팀 2","이영희, 박민수",15,25,35,20,95
...

Game Settings
Current Round,2
Timer Seconds,180
Timer Running,false
Display Mode,scoreboard
Auto Switch,true
Timer Message,"진행 중"
Export Date,2024-10-21T12:30:45.123Z
```

## 🔧 데이터 초기화

### 완전 초기화
```javascript
localStorage.removeItem('game-state');
location.reload();
```

### 브라우저에서 직접
1. F12 → Application/Storage 탭
2. Local Storage → 해당 도메인
3. `game-state` 키 삭제

## 📱 다중 기기 사용 시 주의사항

- **같은 브라우저, 같은 컴퓨터**: 모든 탭에서 실시간 동기화 ✅
- **다른 브라우저**: 데이터 공유 안됨 ❌
- **다른 컴퓨터/스마트폰**: 데이터 공유 안됨 ❌

각 기기마다 독립적인 데이터를 가지므로, 여러 기기에서 동시에 관리할 때는 주의가 필요합니다.