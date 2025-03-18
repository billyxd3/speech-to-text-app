import React from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".csv,.txt,.json"
        onChange={handleFileChange}
        id="file-input"
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="upload-button">
        Upload File (CSV, TXT, JSON)
      </label>
    </div>
  );
};

export default FileUpload;
