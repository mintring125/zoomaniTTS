import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, clearAllMessages } from '../services/storageService';

function MessageHistory({ onLoadMessage }) {
    const [messages, setMessages] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setMessages(getMessages());
    }, []);

    const refreshMessages = () => {
        setMessages(getMessages());
    };

    const handleLoad = (text) => {
        if (onLoadMessage) {
            onLoadMessage(text);
            // 스크롤 상단으로 이동
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDelete = (id) => {
        const updated = deleteMessage(id);
        setMessages(updated);
    };

    const handleClearAll = () => {
        if (window.confirm('모든 메시지 기록을 삭제하시겠습니까?')) {
            clearAllMessages();
            setMessages([]);
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200">
            <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={() => { setIsExpanded(!isExpanded); refreshMessages(); }}
            >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    📝 지난 기록 보기
                    <span className="text-base text-gray-500 font-normal">({messages.length}개)</span>
                </h3>
                <button className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                    <span className="text-gray-600 text-xl font-bold block w-8 text-center">
                        {isExpanded ? '▲' : '▼'}
                    </span>
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 border-t-2 border-gray-100 pt-4">
                    {messages.length === 0 ? (
                        <p className="text-lg text-gray-400 text-center py-8">
                            저장된 메시지가 없습니다
                        </p>
                    ) : (
                        <>
                            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                                    >
                                        <div className="flex-1 min-w-0 mr-4 mb-3 sm:mb-0">
                                            <p className="text-lg text-gray-800 font-medium mb-1">
                                                {truncateText(msg.text)}
                                            </p>
                                            <p className="text-base text-gray-500">
                                                {formatDate(msg.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLoad(msg.text); }}
                                                className="flex-1 sm:flex-none px-4 py-2 text-base font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                불러오기
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                className="flex-1 sm:flex-none px-4 py-2 text-base font-bold bg-white text-red-600 border-2 border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleClearAll}
                                className="mt-4 w-full py-4 text-base font-bold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>🗑️</span>
                                <span>전체 기록 삭제하기</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default MessageHistory;
