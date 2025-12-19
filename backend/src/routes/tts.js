const express = require('express');
const router = express.Router();
const googleTTSService = require('../services/googleTTSService');

/**
 * POST /api/tts/synthesize
 * 텍스트를 음성으로 변환
 */
router.post('/synthesize', async (req, res, next) => {
  try {
    const {
      text,
      languageCode = 'ko-KR',
      voiceName = 'ko-KR-Standard-A',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0
    } = req.body;

    // TTS 합성 수행
    const audioContent = await googleTTSService.synthesize({
      text,
      languageCode,
      voiceName,
      speakingRate,
      pitch,
      volumeGainDb
    });

    // Base64로 인코딩하여 반환
    const audioBase64 = audioContent.toString('base64');
    const audioDataUri = `data:audio/mp3;base64,${audioBase64}`;

    res.json({
      success: true,
      audioContent: audioDataUri,
      textLength: text.length,
      audioConfig: {
        audioEncoding: 'MP3',
        sampleRateHertz: 24000,
        voiceName,
        speakingRate,
        pitch,
        volumeGainDb
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tts/voices
 * 사용 가능한 음성 목록 조회
 */
router.get('/voices', async (req, res, next) => {
  try {
    const voices = googleTTSService.getKoreanVoices();

    res.json({
      success: true,
      voices
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tts/health
 * 서버 상태 확인
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
