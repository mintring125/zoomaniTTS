# 한글 TTS 웹 애플리케이션

Google Cloud Text-to-Speech API를 사용하는 한글 텍스트 음성 변환(TTS) 웹 애플리케이션입니다.

## 프로젝트 구조

```
TTS Program/
├── frontend/          # React + Vite 프론트엔드
├── backend/           # Express.js 백엔드
├── SPEC.md           # 프로젝트 상세 스펙
└── README.md         # 이 파일
```

## 기능

- 한글 텍스트를 자연스러운 음성으로 변환
- 여러 음성 선택 (여성/남성, Standard/WaveNet)
- 음성 속도, 음높이, 음량 조절
- 음성 파일 다운로드 (.mp3)
- 텍스트 파일 업로드 (.txt)
- 반응형 디자인 (데스크톱/모바일)

## 기술 스택

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Google Cloud Text-to-Speech API

## 설치 및 실행

### 사전 요구사항

1. Node.js 18+ 설치
2. Google Cloud 계정 및 프로젝트 생성
3. Text-to-Speech API 활성화
4. 서비스 계정 JSON 키 파일 다운로드

### Google Cloud 설정

#### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. "API 및 서비스" → "라이브러리"
4. "Cloud Text-to-Speech API" 검색 및 활성화

#### 2. 서비스 계정 생성

1. "IAM 및 관리" → "서비스 계정"
2. "서비스 계정 만들기" 클릭
3. 역할: "Cloud Text-to-Speech 사용자" 선택
4. "키" 탭에서 JSON 키 다운로드
5. 다운로드한 파일을 `backend/credentials/google-credentials.json`에 저장

### Backend 설정 및 실행

```bash
# backend 디렉토리로 이동
cd backend

# 패키지 설치
npm install

# .env 파일 확인 및 수정
# GOOGLE_PROJECT_ID를 실제 프로젝트 ID로 변경

# 개발 서버 실행
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

### Frontend 설정 및 실행

```bash
# frontend 디렉토리로 이동 (새 터미널)
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저가 자동으로 http://localhost:5173 을 엽니다.

## 환경 변수 설정

### backend/.env

```env
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-credentials.json
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_API_KEY=your-api-key

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API 엔드포인트

### POST /api/tts/synthesize
텍스트를 음성으로 변환

**Request:**
```json
{
  "text": "안녕하세요",
  "voiceName": "ko-KR-Standard-A",
  "speakingRate": 1.0,
  "pitch": 0.0,
  "volumeGainDb": 0.0
}
```

**Response:**
```json
{
  "success": true,
  "audioContent": "data:audio/mp3;base64,...",
  "textLength": 5,
  "audioConfig": {...}
}
```

### GET /api/tts/voices
사용 가능한 음성 목록 조회

### GET /api/tts/health
서버 상태 확인

## 사용 방법

1. 텍스트 입력란에 읽을 텍스트 입력 (최대 5000자)
2. 원하는 음성 선택 (여성/남성, 무료/유료)
3. 속도, 음높이, 음량 조절 (선택사항)
4. "읽기" 버튼 클릭
5. 음성이 자동으로 재생됨
6. "저장" 버튼으로 MP3 파일 다운로드 가능

## 비용 정보

### Google Cloud TTS 무료 한도 (매월)
- Standard voices: 400만 글자
- WaveNet voices: 100만 글자

### 일반 사용 시나리오
- 하루 1000자 × 30일 = 30,000자/월 → **무료**
- 하루 5000자 × 30일 = 150,000자/월 → **무료**
- 하루 10,000자 × 30일 = 300,000자/월 → **무료**

**개인 사용 시 대부분 무료로 이용 가능합니다!**

## 주요 음성 목록

### Standard (무료 한도 높음)
- ko-KR-Standard-A: 여성 목소리
- ko-KR-Standard-B: 여성 목소리 (부드러운)
- ko-KR-Standard-C: 남성 목소리
- ko-KR-Standard-D: 남성 목소리 (중저음)

### WaveNet (고품질)
- ko-KR-Wavenet-A: 여성 (자연스러운)
- ko-KR-Wavenet-B: 여성 (감성적)
- ko-KR-Wavenet-C: 남성 (차분한)
- ko-KR-Wavenet-D: 남성 (중저음)

## 문제 해결

### Backend 서버 연결 실패
1. Backend 서버가 실행 중인지 확인
2. PORT 5000이 사용 중이 아닌지 확인
3. CORS 설정 확인

### Google Cloud 인증 오류
1. `google-credentials.json` 파일이 올바른 위치에 있는지 확인
2. .env 파일의 `GOOGLE_PROJECT_ID`가 정확한지 확인
3. Text-to-Speech API가 활성화되어 있는지 확인

### 음성 재생 안됨
1. 브라우저 콘솔에서 에러 메시지 확인
2. 텍스트가 5000자 이하인지 확인
3. 인터넷 연결 확인

## 라이선스

ISC

## 참고 자료

- [Google Cloud Text-to-Speech 문서](https://cloud.google.com/text-to-speech/docs)
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
