import React, { useState } from "react";
import styles from "./SelectElement.module.css";

const SelectInput = ({ onSelect, disabled }) => {
  const [selectedValue, setSelectedValue] = useState("1");

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    onSelect(e);
  };

  return (
    <div className={styles.selectContainer}>
      <select
        className={styles.selectElement}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
  );
};

export default SelectInput;
