import React from "react";
import ReactDOM from "react-dom";
import styles from "./CustomModal.module.css";

const CustomModal = ({ children, onClose }) => {

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };


    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.content}>{children}</div>
            </div>
        </div>,
        document.getElementById("root") // Make sure this element exists in your HTML
    );
};

export default CustomModal;