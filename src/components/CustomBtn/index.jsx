import { useState } from "react";
import styles from "./CustomBtn.module.css";

function CustomButton({ handleClick, title }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    // setIsLoading(true);
    handleClick(); // Call your export function
    // setTimeout(() => setIsLoading(false), 2000); // Simulate export duration
  };

  return (
    <button
      onClick={handleExport}
      className={styles.customButton}
      aria-label="Export Excel File"
      //   disabled={isLoading}
    >
      {isLoading ? "Exporting..." : title}
    </button>
  );
}

export default CustomButton;
