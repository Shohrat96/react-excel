import React, { useRef } from "react";
import styles from "./FileInput.module.css";

const FileInput = ({ handleFileUpload }) => {
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {

    handleFileUpload(e);
    // Reset file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className={styles.fileInputContainer}>
      {/* File input hidden by default, but triggered by custom button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xlsx, .xls"
        onChange={onFileChange}
        className={styles.fileInput}
        id="file-upload"
      />

      {/* Custom button to trigger file input */}
      <label htmlFor="file-upload" className={styles.fileInputButton}>
        Upload Flight List
      </label>

      {/* Optional label text for file selection */}
      {/* <span className={styles.fileInputLabel}>Accepts .xlsx, .xls formats</span> */}
    </div>
  );
};

export default FileInput;
