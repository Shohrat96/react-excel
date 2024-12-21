import React, { useState, useEffect } from "react";
import styles from "./TimeSelector.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const TimeSelector = () => {
  const [timeFormat, setTimeFormat] = useState("UTC"); // Default to LOCAL
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Format time based on selection
  const formatTime = () => {
    if (timeFormat === "UTC") {
      return dayjs(currentTime).utc().format("YYYY-MM-DD HH:mm:ss");
    } else {
      return dayjs(currentTime).format("YYYY-MM-DD HH:mm:ss");
    }
  };

  return (
    <div className={styles.timeSelector}>
      <div className={styles.dropdownWrapper}>
        <select
          id="time-format"
          value={timeFormat}
          onChange={(e) => setTimeFormat(e.target.value)}
          className={styles.dropdown}
        >
          <option value="LOCAL">Local</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
      <div className={styles.timeDisplay}>
        {/* <span className={styles.timeLabel}>Current Time: </span> */}
        <span className={styles.timeValue}>{formatTime()}</span>
      </div>
    </div>
  );
};

export default TimeSelector;
