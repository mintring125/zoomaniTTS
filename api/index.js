const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ttsRoutes = require('../backend/src/routes/tts');

const app = express();

// 보안 미들웨어
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: '너무 많은 요청이 감지되었습니다. 15분 후에 다시 시도해주세요.',
        code: 'RATE_LIMIT_EXCEEDED'
    }
});

app.use('/api/tts', limiter);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/tts', ttsRoutes);

// Vercel Serverless Function export
module.exports = app;
