import styles from "./CustomSlider.module.css"

const CustomSliderComponent = ({active, toggleActive, activeTitle, deactiveTitle}) => {
    return (
    <div className={styles.toggleContainer}>
        <span className={styles.toggleLabel}>
            {active ? activeTitle : deactiveTitle}
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