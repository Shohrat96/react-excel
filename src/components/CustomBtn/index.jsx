import { useState } from "react";
import styles from "./CustomBtn.module.css";

function CustomButton({ handleClick, title, disabled }) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    // setIsLoading(true);
    handleClick(); // Call your export function
    // setTimeout(() => setIsLoading(false), 2000); // Simulate export duration
  };

  return (
    <button
      onClick={onClick}
      className={styles.customButton}
      aria-label={title || "Export Excel File"}
      disabled={disabled}
      //   disabled={isLoading}
    >
      {isLoading ? "In progress..." : title}
    </button>
  );
}

export default CustomButton;
