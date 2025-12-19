/**
 * 에러 처리 미들웨어
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // 에러 타입별 처리
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = '서버 오류가 발생했습니다.';

  if (err.message.includes('5000자')) {
    statusCode = 400;
    errorCode = 'TEXT_TOO_LONG';
    message = err.message;
  } else if (err.message.includes('입력')) {
    statusCode = 400;
    errorCode = 'INVALID_INPUT';
    message = err.message;
  } else if (err.message.includes('인증')) {
    statusCode = 401;
    errorCode = 'AUTHENTICATION_ERROR';
    message = 'Google Cloud 인증에 실패했습니다.';
  } else if (err.message.includes('음성 합성')) {
    statusCode = 503;
    errorCode = 'TTS_SERVICE_ERROR';
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
