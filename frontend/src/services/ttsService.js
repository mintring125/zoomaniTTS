import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 서버 응답이 있는 경우
      throw new Error(error.response.data.error || '서버 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 오류
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
);

/**
 * TTS 서비스
 */
class TTSService {
  /**
   * 텍스트를 음성으로 변환
   * @param {Object} params - TTS 파라미터
   * @returns {Promise<Object>} 음성 데이터
   */
  async synthesize(params) {
    try {
      const response = await apiClient.post('/tts/synthesize', params);
      return response.data;
    } catch (error) {
      console.error('TTS Synthesize Error:', error);
      throw error;
    }
  }

  /**
   * 사용 가능한 음성 목록 조회
   * @returns {Promise<Array>} 음성 목록
   */
  async getVoices() {
    try {
      const response = await apiClient.get('/tts/voices');
      return response.data.voices;
    } catch (error) {
      console.error('Get Voices Error:', error);
      throw error;
    }
  }

  /**
   * 서버 상태 확인
   * @returns {Promise<Object>} 서버 상태
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/tts/health');
      return response.data;
    } catch (error) {
      console.error('Health Check Error:', error);
      throw error;
    }
  }
}

export default new TTSService();
