import { checkUsageLimit } from '../services/storageService';

/**
 * 사용량 추적 컴포넌트 - 월별 사용량을 프로그레스 바로 표시
 */
function UsageTracker({ usage }) {
    const { percentage, current, limit, isOverLimit } = usage || checkUsageLimit();

    // 색상 결정
    const getBarColor = () => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-yellow-500';
        if (percentage >= 60) return 'bg-blue-400';
        return 'bg-green-500';
    };

    // 숫자 포맷팅 (1,000,000 형식)
    const formatNumber = (num) => {
        return num.toLocaleString('ko-KR');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    📊 이번 달 사용량
                </h3>
                <span className={`text-lg font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-700'}`}>
                    {percentage.toFixed(1)}%
                </span>
            </div>

            {/* 프로그레스 바 (더 두껍게) */}
            <div className="w-full bg-gray-200 rounded-full h-6 mb-3">
                <div
                    className={`h-6 rounded-full transition-all duration-300 ${getBarColor()}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            <div className="flex justify-between text-base text-gray-600 font-medium">
                <span>{formatNumber(current)} / {formatNumber(limit)} 글자</span>
                {isOverLimit && (
                    <span className="text-red-600 font-bold">
                        ⚠️ 사용 한도 초과
                    </span>
                )}
            </div>

            {isOverLimit && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-base text-red-700 font-medium">
                    월 무료 사용량(400만 자)을 모두 사용했습니다. 다음 달에 초기화됩니다.
                </div>
            )}
        </div>
    );
}

export default UsageTracker;
