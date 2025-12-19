/**
 * TTS를 위한 텍스트 전처리 함수
 */

/**
 * 이모티콘 제거
 */
export const removeEmojis = (text) => {
    return text.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}]/gu,
        ''
    );
};

/**
 * URL을 읽기 쉬운 형태로 변환
 */
export const formatUrls = (text) => {
    // https://example.com -> "링크"로 대체
    return text.replace(/https?:\/\/[^\s]+/g, '링크');
};

/**
 * 특수 기호 처리
 */
export const cleanSpecialChars = (text) => {
    return text
        .replace(/\*\*/g, '') // 볼드 마크다운 제거
        .replace(/\*/g, '')   // 이탤릭 마크다운 제거
        .replace(/~/g, '')    // 취소선 마크다운 제거
        .replace(/#/g, '')    // 해시태그 기호 제거
        .replace(/`/g, '');   // 코드 블록 기호 제거
};

/**
 * 여러 줄바꿈을 하나로 통일
 */
export const normalizeLineBreaks = (text) => {
    return text.replace(/\n{3,}/g, '\n\n').trim();
};

/**
 * TTS용 텍스트 전처리 (모든 전처리 통합)
 */
export const preprocessTextForTTS = (text) => {
    if (!text) return '';

    let processed = text;

    // 1. 이모티콘 제거
    processed = removeEmojis(processed);

    // 2. URL 포맷팅
    processed = formatUrls(processed);

    // 3. 특수 기호 정리
    processed = cleanSpecialChars(processed);

    // 4. 줄바꿈 정규화
    processed = normalizeLineBreaks(processed);

    // 5. 앞뒤 공백 제거
    processed = processed.trim();

    return processed;
};
