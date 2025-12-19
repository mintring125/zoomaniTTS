import { useState, useRef, useEffect } from 'react';
import TextInput from './components/TextInput';
import SettingsPanel from './components/SettingsPanel';
import ControlPanel from './components/ControlPanel';
import FileUpload from './components/FileUpload';
import UsageTracker from './components/UsageTracker';
import MessageHistory from './components/MessageHistory';
import ttsService from './services/ttsService';
import { checkUsageLimit, addUsage, saveMessage } from './services/storageService';
import { TTS_CONSTANTS, PLAYER_STATUS, ERROR_MESSAGES } from './utils/constants';
import './App.css';

function App() {
  // 상태 관리
  const [text, setText] = useState('');
  const [settings, setSettings] = useState({
    languageCode: TTS_CONSTANTS.DEFAULT_LANGUAGE_CODE,
    voiceName: TTS_CONSTANTS.DEFAULT_VOICE_NAME,
    speakingRate: TTS_CONSTANTS.DEFAULT_SPEAKING_RATE,
    pitch: TTS_CONSTANTS.DEFAULT_PITCH,
    volumeGainDb: TTS_CONSTANTS.DEFAULT_VOLUME
  });
  const [status, setStatus] = useState(PLAYER_STATUS.IDLE);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(null);

  // Audio 참조
  const audioRef = useRef(null);
  // MessageHistory 새로고침을 위한 키
  const [historyKey, setHistoryKey] = useState(0);

  // 사용량 초기 로드
  useEffect(() => {
    setUsage(checkUsageLimit());
  }, []);

  // 텍스트 검증
  const validateText = () => {
    if (!text || text.trim().length === 0) {
      setError(ERROR_MESSAGES.EMPTY_TEXT);
      return false;
    }
    if (text.length > TTS_CONSTANTS.MAX_TEXT_LENGTH) {
      setError(ERROR_MESSAGES.TEXT_TOO_LONG);
      return false;
    }
    setError(null);
    return true;
  };

  // 읽기 버튼 클릭
  const handlePlay = async () => {
    if (!validateText()) {
      return;
    }

    // 사용량 체크 (100% 초과 시 차단)
    const currentUsage = checkUsageLimit();
    if (currentUsage.isOverLimit) {
      setError('월 무료 사용량(400만 자)을 모두 사용했습니다. 다음 달까지 기다려주세요.');
      setStatus(PLAYER_STATUS.ERROR);
      return;
    }

    try {
      setStatus(PLAYER_STATUS.LOADING);
      setError(null);

      // TTS API 호출
      const response = await ttsService.synthesize({
        text,
        ...settings
      });

      // 오디오 URL 생성
      const audioDataUri = response.audioContent;
      setAudioUrl(audioDataUri);

      // 오디오 재생
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
        setStatus(PLAYER_STATUS.PLAYING);
      }

      // 성공 시 사용량 추가 및 메시지 저장
      addUsage(text.length);
      saveMessage(text);
      setUsage(checkUsageLimit());
      setHistoryKey(prev => prev + 1); // 히스토리 새로고침

    } catch (err) {
      console.error('TTS Error:', err);
      setError(err.message || ERROR_MESSAGES.TTS_ERROR);
      setStatus(PLAYER_STATUS.ERROR);
    }
  };

  // 정지 버튼 클릭
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStatus(PLAYER_STATUS.IDLE);
    }
  };

  // 오디오 재생 완료
  const handleAudioEnded = () => {
    setStatus(PLAYER_STATUS.IDLE);
  };

  // 음성 다운로드
  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `tts-audio-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 파일 업로드 처리
  const handleFileLoad = (content) => {
    setText(content);
  };

  // 메시지 히스토리에서 불러오기
  const handleLoadMessage = (messageText) => {
    setText(messageText);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 심플한 헤더 */}
        <div className="text-center py-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
            <button
              onClick={handlePlay}
              className="text-4xl text-blue-600 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="읽어주기"
            >
              🔊
            </button>
            <span>주마니 한글 음성 변환기</span>
          </h1>
        </div>

        {/* 에러 메시지 (최상단) */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm animate-fade-in-down">
            <div className="flex items-start">
              <span className="text-3xl mr-4">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-1">오류가 발생했습니다</h3>
                <p className="text-lg text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 1. 핵심 기능 영역 (입력 + 제어) - 가장 중요하므로 최상단 크게 배치 */}
        <section className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-blue-100">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>✍️</span> 내용 입력하기
            </h2>
            <p className="text-blue-100 mt-1 font-medium text-lg">읽어주기를 원하는 내용을 아래에 입력하세요.</p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <TextInput text={text} setText={setText} />

            <ControlPanel
              status={status}
              onPlay={handlePlay}
              onStop={handleStop}
              onDownload={handleDownload}
              audioUrl={audioUrl}
            />

            <div className="pt-4 border-t border-gray-100">
              <FileUpload onFileLoad={handleFileLoad} />
            </div>
          </div>
        </section>

        {/* 2. 보조 기능 영역 (설정, 히스토리) */}
        <div className="grid grid-cols-1 gap-8">
          {/* 기록 */}
          <MessageHistory key={historyKey} onLoadMessage={handleLoadMessage} />

          {/* 사용량 */}
          <UsageTracker usage={usage} />

          {/* 설정 */}
          <SettingsPanel settings={settings} setSettings={setSettings} />
        </div>

        {/* 푸터 */}
        <footer className="text-center text-gray-500 py-8 text-base font-medium">
          <p>© 2025 한글 음성 변환 프로그램</p>
        </footer>

        {/* 숨겨진 오디오 플레이어 */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default App;
