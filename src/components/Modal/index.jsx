import React from "react";
import styles from "./Modal.module.css";

function Modal({ closeModal, children }) {
    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <button className={styles.closeButton} onClick={closeModal}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
