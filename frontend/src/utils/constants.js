// API 설정
// 배포 환경(Vercel)에서는 상대 경로 사용, 개발 환경에서는 환경 변수 또는 로컬 주소 사용
export const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

// TTS 설정 상수
export const TTS_CONSTANTS = {
  MAX_TEXT_LENGTH: 5000,
  DEFAULT_LANGUAGE_CODE: 'ko-KR',
  DEFAULT_VOICE_NAME: 'ko-KR-Standard-A',
  DEFAULT_SPEAKING_RATE: 1.0,
  DEFAULT_PITCH: 0.0,
  DEFAULT_VOLUME: 0.0
};

// 음성 속도 범위
export const SPEAKING_RATE = {
  MIN: 0.5,
  MAX: 2.0,
  DEFAULT: 1.0,
  STEP: 0.1
};

// 음높이 범위
export const PITCH = {
  MIN: -10,
  MAX: 10,
  DEFAULT: 0,
  STEP: 1
};

// 음량 범위 (dB)
export const VOLUME = {
  MIN: -10,
  MAX: 10,
  DEFAULT: 0,
  STEP: 1
};

// 플레이어 상태
export const PLAYER_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error'
};

// 에러 메시지
export const ERROR_MESSAGES = {
  EMPTY_TEXT: '텍스트를 입력해주세요.',
  TEXT_TOO_LONG: `텍스트는 ${TTS_CONSTANTS.MAX_TEXT_LENGTH}자를 초과할 수 없습니다.`,
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  TTS_ERROR: '음성 합성 중 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
};
