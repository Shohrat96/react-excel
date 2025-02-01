import React, { useState } from "react";
import styles from "./RadioBtn.module.css";

const RadioButton = ({ options, onSelect, selected }) => {

    const handleChange = (value) => {
        onSelect(value);
    };

    return (
        <div className={styles.radioGroup}>
            {options.map((option, index) => (
                <label key={index} className={styles.radioLabel}>
                    <input
                        type="radio"
                        name="customRadio"
                        value={option}
                        checked={selected === option}
                        onChange={() => handleChange(option)}
                        className={styles.radioInput}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default RadioButton;
