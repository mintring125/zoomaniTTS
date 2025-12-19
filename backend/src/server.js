require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ttsRoutes = require('./routes/tts');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== 보안 미들웨어 설정 ====================

// 1. Helmet: 보안 HTTP 헤더 설정
app.use(helmet());

// 2. Rate Limiting: 과도한 요청 방지 (과금 폭탄 보호)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 300, // IP당 최대 300회 요청 (넉넉하게 설정)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: '너무 많은 요청이 감지되었습니다. 15분 후에 다시 시도해주세요.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// TTS API 경로에만 속도 제한 적용
app.use('/api/tts', limiter);

// ==================== 기본 미들웨어 설정 ====================

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 배포 시 도메인 지정 권장
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 라우트 설정
app.use('/api/tts', ttsRoutes);

// 루트 경로
app.get('/', (req, res) => {
  res.json({
    message: 'Korean TTS Backend API',
    version: '1.0.0',
    endpoints: {
      synthesize: 'POST /api/tts/synthesize',
      voices: 'GET /api/tts/voices',
      health: 'GET /api/tts/health'
    }
  });
});

// 에러 핸들러 (마지막에 추가)
app.use(errorHandler);

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청하신 경로를 찾을 수 없습니다.',
    code: 'NOT_FOUND'
  });
});

// 서버 시작 (Vercel 환경에서는 필요 없을 수 있으나 로컬 테스트용 유지)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Korean TTS Backend Server Running   ║
╠════════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  CORS Origin: ${process.env.CORS_ORIGIN || '*'}
╚════════════════════════════════════════╝
    `);
  });
} else {
  // 배포 환경
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
