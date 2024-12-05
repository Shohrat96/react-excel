import React from "react";
import styles from "./FileInput.module.css";

const FileInput = ({ handleFileUpload }) => {
  return (
    <div className={styles.fileInputContainer}>
      {/* File input hidden by default, but triggered by custom button */}
      <input
        type="file"
        multiple
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className={styles.fileInput}
        id="file-upload"
      />

      {/* Custom button to trigger file input */}
      <label htmlFor="file-upload" className={styles.fileInputButton}>
        Choose File
      </label>

      {/* Optional label text for file selection */}
      <span className={styles.fileInputLabel}>Accepts .xlsx, .xls formats</span>
    </div>
  );
};

export default FileInput;
