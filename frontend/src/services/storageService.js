/**
 * LocalStorage 서비스 - 사용량 추적 및 메시지 히스토리 관리
 */

const STORAGE_KEYS = {
    MONTHLY_USAGE: 'tts_monthly_usage',
    MESSAGE_HISTORY: 'tts_message_history'
};

const MONTHLY_LIMIT = 4000000; // 월 400만 글자
const WARNING_THRESHOLD = 1.0; // 100% (무료 한도 꽉 채워서 사용)
const MAX_HISTORY_ITEMS = 20;

// ==================== 사용량 관리 ====================

/**
 * 현재 년-월 문자열 반환 (예: "2025-12")
 */
const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * 월별 사용량 조회
 * @returns {{ month: string, chars: number }}
 */
export const getMonthlyUsage = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_USAGE);
        if (!data) {
            return { month: getCurrentMonth(), chars: 0 };
        }

        const usage = JSON.parse(data);

        // 월이 바뀌었으면 리셋
        if (usage.month !== getCurrentMonth()) {
            const newUsage = { month: getCurrentMonth(), chars: 0 };
            localStorage.setItem(STORAGE_KEYS.MONTHLY_USAGE, JSON.stringify(newUsage));
            return newUsage;
        }

        return usage;
    } catch (e) {
        console.error('사용량 조회 오류:', e);
        return { month: getCurrentMonth(), chars: 0 };
    }
};

/**
 * 사용량 추가
 * @param {number} charCount - 추가할 글자 수
 */
export const addUsage = (charCount) => {
    try {
        const usage = getMonthlyUsage();
        usage.chars += charCount;
        localStorage.setItem(STORAGE_KEYS.MONTHLY_USAGE, JSON.stringify(usage));
        return usage;
    } catch (e) {
        console.error('사용량 추가 오류:', e);
    }
};

/**
 * 사용량 한도 초과 여부 확인
 * @returns {{ isOverLimit: boolean, percentage: number, remaining: number }}
 */
export const checkUsageLimit = () => {
    const usage = getMonthlyUsage();
    const percentage = usage.chars / MONTHLY_LIMIT;
    const remaining = Math.max(0, MONTHLY_LIMIT - usage.chars);

    return {
        isOverLimit: percentage >= WARNING_THRESHOLD,
        percentage: Math.min(percentage * 100, 100),
        remaining,
        current: usage.chars,
        limit: MONTHLY_LIMIT
    };
};

// ==================== 메시지 히스토리 관리 ====================

/**
 * 메시지 저장
 * @param {string} text - 저장할 텍스트
 */
export const saveMessage = (text) => {
    try {
        if (!text || text.trim().length === 0) return;

        const history = getMessages();
        const newMessage = {
            id: Date.now(),
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        // 중복 제거 (같은 텍스트가 있으면 제거 후 맨 앞에 추가)
        const filtered = history.filter(m => m.text !== text.trim());
        filtered.unshift(newMessage);

        // 최대 개수 유지
        const limited = filtered.slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEYS.MESSAGE_HISTORY, JSON.stringify(limited));

        return limited;
    } catch (e) {
        console.error('메시지 저장 오류:', e);
        return [];
    }
};

/**
 * 저장된 메시지 목록 조회
 * @returns {Array<{ id: number, text: string, createdAt: string }>}
 */
export const getMessages = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MESSAGE_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('메시지 조회 오류:', e);
        return [];
    }
};

/**
 * 특정 메시지 삭제
 * @param {number} id - 삭제할 메시지 ID
 */
export const deleteMessage = (id) => {
    try {
        const history = getMessages();
        const filtered = history.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEYS.MESSAGE_HISTORY, JSON.stringify(filtered));
        return filtered;
    } catch (e) {
        console.error('메시지 삭제 오류:', e);
        return [];
    }
};

/**
 * 전체 메시지 삭제
 */
export const clearAllMessages = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.MESSAGE_HISTORY);
        return [];
    } catch (e) {
        console.error('전체 삭제 오류:', e);
        return [];
    }
};

/**
 * 사용량 초기화 (테스트용)
 */
export const resetUsage = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.MONTHLY_USAGE);
    } catch (e) {
        console.error('사용량 초기화 오류:', e);
    }
};
