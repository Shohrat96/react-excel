import styles from "./CustomSlider.module.css"

const CustomSliderComponent = ({ active, toggleActive, title }) => {
    return (
        <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>
                {title}
            </span>
            <div
                className={`${styles.toggleSwitch} ${active ? styles.active : ""
                    }`}
                onClick={toggleActive}
            ></div>
        </div>
    )
}

export default CustomSliderComponent