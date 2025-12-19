const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

class GoogleTTSService {
  constructor() {
    this.apiUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';
    this.voicesUrl = 'https://texttospeech.googleapis.com/v1/voices';
    this.auth = null;
    this.initAuth();
  }

  /**
   * 서비스 계정 인증 초기화
   * Vercel 등 배포 환경을 위해 환경 변수(GOOGLE_CREDENTIALS_JSON) 우선 지원
   */
  initAuth() {
    try {
      // 1. 환경 변수에서 JSON 직접 로드 (Vercel 배포용)
      if (process.env.GOOGLE_CREDENTIALS_JSON) {
        try {
          const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
          this.auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
          });
          console.log('✅ Google Cloud 인증 초기화 완료 (환경 변수 JSON 사용)');
          return;
        } catch (jsonError) {
          console.error('❌ GOOGLE_CREDENTIALS_JSON 파싱 실패:', jsonError.message);
        }
      }

      // 2. 파일 경로 기반 인증 (로컬 개발용)
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (credentialsPath) {
        const absolutePath = path.resolve(__dirname, '../../', credentialsPath);
        if (fs.existsSync(absolutePath)) {
          this.auth = new GoogleAuth({
            keyFile: absolutePath,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
          });
          console.log('✅ Google Cloud 인증 초기화 완료 (파일 경로 사용)');
          return;
        } else {
          console.warn('⚠️ 서비스 계정 파일을 찾을 수 없습니다:', absolutePath);
        }
      }

      console.warn('⚠️ Google Cloud 인증 정보를 찾을 수 없습니다. TTS 기능이 작동하지 않을 수 있습니다.');
    } catch (error) {
      console.error('❌ 인증 초기화 실패:', error.message);
    }
  }

  /**
   * Access Token 가져오기
   */
  async getAccessToken() {
    if (!this.auth) {
      throw new Error('인증이 초기화되지 않았습니다. GOOGLE_CREDENTIALS_JSON 또는 GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 확인해주세요.');
    }
    try {
      const client = await this.auth.getClient();
      const accessToken = await client.getAccessToken();
      // console.log('✅ Access Token 획득 성공'); // 로그 너무 많아서 주석 처리
      return accessToken.token;
    } catch (error) {
      console.error('❌ Access Token 획득 실패:', error.message);
      console.error('상세 오류:', JSON.stringify(error, null, 2));
      throw new Error(`인증 토큰 획득 실패: ${error.message}`);
    }
  }

  /**
   * 텍스트를 음성으로 변환
   * @param {Object} options - TTS 옵션
   * @returns {Promise<Buffer>} 오디오 데이터
   */
  async synthesize(options) {
    const {
      text,
      languageCode = 'ko-KR',
      voiceName = 'ko-KR-Standard-A',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0
    } = options;

    // 입력 검증
    if (!text || text.trim().length === 0) {
      throw new Error('텍스트를 입력해주세요.');
    }

    if (text.length > 5000) {
      throw new Error('텍스트는 5000자를 초과할 수 없습니다.');
    }

    // Google TTS API 요청 구성
    const requestBody = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Math.max(0.25, Math.min(4.0, speakingRate)),
        pitch: Math.max(-20.0, Math.min(20.0, pitch)),
        volumeGainDb: Math.max(-96.0, Math.min(16.0, volumeGainDb)),
        sampleRateHertz: 24000
      }
    };

    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Base64로 인코딩된 오디오 데이터를 Buffer로 변환
      const audioContent = Buffer.from(response.data.audioContent, 'base64');
      return audioContent;
    } catch (error) {
      console.error('Google TTS API Error:', error.response?.data || error.message);

      if (error.response?.status === 403) {
        throw new Error('API 권한이 없습니다. Cloud Text-to-Speech API가 활성화되어 있는지 확인해주세요.');
      } else if (error.response?.status === 400) {
        throw new Error('잘못된 요청입니다. 텍스트나 음성 설정을 확인해주세요.');
      }

      throw new Error(`음성 합성 실패: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * 사용 가능한 음성 목록 조회 (REST API 사용)
   * @param {string} languageCode - 언어 코드
   * @returns {Promise<Array>} 음성 목록
   */
  async listVoices(languageCode = 'ko-KR') {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.voicesUrl}?languageCode=${languageCode}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data.voices || [];
    } catch (error) {
      console.error('List Voices Error:', error.response?.data || error.message);
      // 에러 발생 시 미리 정의된 목록 반환
      return this.getKoreanVoices();
    }
  }

  /**
   * 한국어 음성 목록 (미리 정의)
   * @returns {Array} 한국어 음성 정보
   */
  getKoreanVoices() {
    return [
      {
        id: 'ko-KR-Standard-A',
        name: '한국어 여성 A',
        gender: 'female',
        type: 'Standard',
        description: '표준 여성 목소리 (무료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Standard-B',
        name: '한국어 여성 B',
        gender: 'female',
        type: 'Standard',
        description: '표준 여성 목소리 - 부드러운 톤 (무료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Standard-C',
        name: '한국어 남성 C',
        gender: 'male',
        type: 'Standard',
        description: '표준 남성 목소리 (무료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Standard-D',
        name: '한국어 남성 D',
        gender: 'male',
        type: 'Standard',
        description: '표준 남성 목소리 - 중저음 (무료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Wavenet-A',
        name: '한국어 여성 WaveNet A',
        gender: 'female',
        type: 'WaveNet',
        description: '고품질 여성 목소리 (유료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Wavenet-B',
        name: '한국어 여성 WaveNet B',
        gender: 'female',
        type: 'WaveNet',
        description: '고품질 여성 목소리 - 감성적 (유료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Wavenet-C',
        name: '한국어 남성 WaveNet C',
        gender: 'male',
        type: 'WaveNet',
        description: '고품질 남성 목소리 (유료)',
        languageCode: 'ko-KR'
      },
      {
        id: 'ko-KR-Wavenet-D',
        name: '한국어 남성 WaveNet D',
        gender: 'male',
        type: 'WaveNet',
        description: '고품질 남성 목소리 - 중저음 (유료)',
        languageCode: 'ko-KR'
      }
    ];
  }
}

module.exports = new GoogleTTSService();
