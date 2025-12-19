function TextInput({ text, setText }) {
  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        className="w-full h-64 p-6 text-xl text-gray-900 bg-white border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-inner placeholder-gray-400"
        placeholder="여기에 읽을 내용을 입력하세요."
        value={text}
        onChange={handleChange}
        style={{ lineHeight: '1.8' }}
      />
      <div className="flex justify-between items-center mt-3 text-base text-gray-600 font-medium">
        <span>글자 수: <strong className="text-blue-600 text-lg">{text.length.toLocaleString()}</strong>자</span>
        <button
          onClick={() => setText('')}
          className="text-gray-500 hover:text-red-600 font-bold px-3 py-1 rounded hover:bg-red-50 transition-colors"
          style={{ visibility: text.length > 0 ? 'visible' : 'hidden' }}
        >
          지우기 ✕
        </button>
      </div>
    </div>
  );
}

export default TextInput;
