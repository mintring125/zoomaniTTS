import { PLAYER_STATUS } from '../utils/constants';

function ControlPanel({ status, onPlay, onStop, onDownload, audioUrl }) {
  const isPlaying = status === PLAYER_STATUS.PLAYING;
  const isLoading = status === PLAYER_STATUS.LOADING;
  const isError = status === PLAYER_STATUS.ERROR;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {isPlaying ? (
          <button
            onClick={onStop}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-3xl">⏹</span>
            <span>정지하기</span>
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={isLoading}
            className={`flex-1 text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-3
              ${isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>변환 중...</span>
              </>
            ) : (
              <>
                <span className="text-3xl">▶</span>
                <span>읽어주기</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDownload}
          disabled={!audioUrl}
          className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 border-2 transition-all
            ${!audioUrl
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 shadow-sm'
            }`}
        >
          <span className="text-2xl">💾</span>
          <span>저장하기</span>
        </button>

        {/* 파일 열기 버튼은 기능이 불분명할 수 있으므로 텍스트 명확히 */}
        <div className="hidden">
          {/* 기존 파일 버튼 숨김 처리 (요청 사항에 없음) */}
        </div>
      </div>

      {/* 상태 메시지 */}
      <div className="bg-gray-100 rounded-lg p-3 text-center border border-gray-200">
        <span className="text-gray-600 font-medium text-lg">상태: </span>
        <span className={`font-bold text-lg ${isPlaying ? 'text-blue-600' :
            isLoading ? 'text-blue-500' :
              isError ? 'text-red-500' : 'text-gray-500'
          }`}>
          {
            isPlaying ? '🔊 읽고 있습니다' :
              isLoading ? '⏳ 변환하고 있습니다...' :
                isError ? '❌ 오류가 발생했습니다' :
                  '대기 중'
          }
        </span>
      </div>
    </div>
  );
}

export default ControlPanel;
