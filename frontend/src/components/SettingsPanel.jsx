import { TTS_CONSTANTS, SPEAKING_RATE, PITCH, VOLUME } from '../utils/constants';

function SettingsPanel({ settings, setSettings }) {
  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const voices = [
    { id: 'ko-KR-Standard-A', name: '👩 한국어 여성 A (차분함)', label: '여성 A' },
    { id: 'ko-KR-Standard-B', name: '👩 한국어 여성 B (밝음)', label: '여성 B' },
    { id: 'ko-KR-Standard-C', name: '👨 한국어 남성 C (차분함)', label: '남성 C' },
    { id: 'ko-KR-Standard-D', name: '👨 한국어 남성 D (중저음)', label: '남성 D' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
      <div className="space-y-8">
        {/* 음성 선택 */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🗣️</span> 목소리 선택
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleChange('voiceName', voice.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${settings.voiceName === voice.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
              >
                <div className="text-lg font-bold">{voice.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 속도 조절 */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>⚡</span> 읽는 속도
            </label>
            <span className="text-blue-600 font-bold text-xl">{settings.speakingRate}x</span>
          </div>
          <input
            type="range"
            min={SPEAKING_RATE.MIN}
            max={SPEAKING_RATE.MAX}
            step={SPEAKING_RATE.STEP}
            value={settings.speakingRate}
            onChange={(e) => handleChange('speakingRate', parseFloat(e.target.value))}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
          />
          <div className="flex justify-between text-base text-gray-500 font-medium mt-1">
            <span>느리게 (0.5)</span>
            <span>보통 (1.0)</span>
            <span>빠르게 (2.0)</span>
          </div>
        </div>

        {/* 고급 설정 (접기/펼치기 대신 일단 노출하되 간단하게) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-lg font-bold text-gray-700">음높이 (톤)</label>
              <span className="text-blue-600 font-bold">{settings.pitch}</span>
            </div>
            <input
              type="range"
              min={PITCH.MIN}
              max={PITCH.MAX}
              step={PITCH.STEP}
              value={settings.pitch}
              onChange={(e) => handleChange('pitch', parseFloat(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-lg font-bold text-gray-700">크기 (볼륨)</label>
              <span className="text-blue-600 font-bold">{settings.volumeGainDb}dB</span>
            </div>
            <input
              type="range"
              min={VOLUME.MIN}
              max={VOLUME.MAX}
              step={VOLUME.STEP}
              value={settings.volumeGainDb}
              onChange={(e) => handleChange('volumeGainDb', parseFloat(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
