const FileUpload = ({ onFileLoad }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileLoad(event.target.result);
      };
      reader.readAsText(file, 'UTF-8');
    } else {
      alert('.txt 파일만 업로드 가능합니다.');
    }
  };

  return (
    <div className="w-full">
      <label className="block">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors font-medium">
          <span className="text-lg">📁</span>
          <span>텍스트 파일 열기</span>
        </span>
      </label>
    </div>
  );
};

export default FileUpload;
