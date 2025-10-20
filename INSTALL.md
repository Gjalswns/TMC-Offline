# 설치 가이드

## 문제 해결

### React 19 호환성 문제

이 프로젝트는 React 18과 Next.js 14를 사용하도록 다운그레이드되었습니다. 
React 19는 아직 많은 라이브러리들과 호환성 문제가 있기 때문입니다.

### 설치 단계

1. **Node.js 설치 확인**
   ```bash
   node --version  # v18.17.0 이상 권장
   npm --version   # v9.0.0 이상 권장
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```
   
   만약 peer dependency 경고가 나타나면:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **개발 서버 실행**

   **로컬 접속만:**
   ```bash
   npm run dev
   ```

   **외부 접속 허용 (같은 네트워크의 다른 기기에서 접속 가능):**
   ```bash
   npm run dev:host
   ```

4. **IP 주소 확인 및 접속**
   
   현재 컴퓨터의 접속 URL 확인:
   ```bash
   npm run get-ip
   ```
   
   또는 수동으로 IP 확인:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

### 주요 변경사항

- React 19 → React 18.3.1
- Next.js 15 → Next.js 14.2.33 (보안 패치 적용)
- Tailwind CSS 4 → Tailwind CSS 3.4.15
- Geist 폰트 → Inter 폰트 (호환성 개선)
- TypeScript 타입 정의 업데이트
- 홈페이지를 네비게이션 페이지로 변경
- 관리자 페이지 디자인을 깔끔한 흰색 테두리 스타일로 변경
- 외부 네트워크 접속 지원 추가

### 서버 시간 기반 타이머

정확한 시간 동기화를 위해 서버 시간 기반 타이머 시스템 구현:
- `timerStartTime`: 타이머 시작 시점의 timestamp 저장
- `timerDuration`: 원래 설정된 타이머 지속 시간
- 100ms마다 서버 시간 기반으로 남은 시간 계산
- 여러 클라이언트 간 정확한 시간 동기화

### 스마트 디스플레이 전환

사용자 경험 개선을 위한 지능형 화면 전환:
- 타이머 1분 이하 시 자동으로 타이머 화면 고정
- 긴급 상황에서 점수판이 가려지지 않도록 방지

### Hydration 오류 해결

React의 서버사이드 렌더링과 클라이언트사이드 hydration 간의 불일치를 방지하기 위해:
- `useGameState` 훅에 `isHydrated` 상태 추가
- 클라이언트에서만 localStorage 데이터 로드
- hydration 완료 전까지 로딩 화면 표시

### 호환성 확인

설치 후 다음 명령어로 타입 체크를 실행하세요:
```bash
npx tsc --noEmit
```

### 보안 취약점 해결

Next.js 14.2.33으로 업데이트하여 다음 보안 취약점들이 해결되었습니다:
- Server Actions DoS 취약점
- 개발 서버 정보 노출 취약점  
- 이미지 최적화 캐시 키 혼동 취약점
- 미들웨어 리다이렉트 SSRF 취약점
- 이미지 최적화 콘텐츠 주입 취약점
- 캐시 포이즈닝 레이스 컨디션
- 미들웨어 인증 우회 취약점

### 추가 도구

개발 환경 개선을 위해 다음 도구들을 설치할 수 있습니다:
```bash
# ESLint 설정
npm install --save-dev eslint @next/eslint-config-next

# Prettier 설정  
npm install --save-dev prettier eslint-config-prettier
```