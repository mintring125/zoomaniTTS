/**
 * 텍스트를 청크로 분할 (문장 단위 유지)
 */
export const splitTextIntoChunks = (text, maxChunkSize = 500) => {
    if (text.length <= maxChunkSize) {
        return [text];
    }

    const chunks = [];
    const sentences = text.split(/([.!?。！？]\s+)/); // 문장 부호 + 공백으로 분리

    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        // 현재 청크에 추가해도 maxChunkSize를 넘지 않으면 추가
        if ((currentChunk + sentence).length <= maxChunkSize) {
            currentChunk += sentence;
        } else {
            // 청크가 비어있지 않으면 저장
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
            }
            // 새 청크 시작
            currentChunk = sentence;
        }
    }

    // 마지막 청크 추가
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    // 청크가 없으면 원본 반환
    return chunks.length > 0 ? chunks : [text];
};

/**
 * 문장 단위로 안전하게 분할 (강제 분할 포함)
 */
export const smartSplit = (text, maxSize = 500) => {
    const chunks = [];
    let remaining = text;

    while (remaining.length > maxSize) {
        // 마지막 문장 부호 찾기
        let splitPoint = remaining.lastIndexOf('.', maxSize);
        if (splitPoint === -1) splitPoint = remaining.lastIndexOf('!', maxSize);
        if (splitPoint === -1) splitPoint = remaining.lastIndexOf('?', maxSize);
        if (splitPoint === -1) splitPoint = remaining.lastIndexOf('。', maxSize);

        // 문장 부호가 너무 앞에 있거나 없으면 공백으로 찾기
        if (splitPoint < maxSize * 0.5) {
            splitPoint = remaining.lastIndexOf(' ', maxSize);
        }

        // 그래도 없으면 강제로 자르기
        if (splitPoint === -1 || splitPoint < maxSize * 0.3) {
            splitPoint = maxSize;
        } else {
            splitPoint++; // 문장 부호 포함
        }

        chunks.push(remaining.substring(0, splitPoint).trim());
        remaining = remaining.substring(splitPoint).trim();
    }

    if (remaining) {
        chunks.push(remaining);
    }

    return chunks;
};
