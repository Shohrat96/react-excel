import { useState, useEffect, useRef } from "react";
import styles from './Dropdown.module.css';

const Dropdown = ({ destinations, selectedDestinations, handleCheckboxChange }) => {

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Ref for the dropdown menu

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.dropdownBtn} onClick={toggleDropdown}>
                Dest ▼
            </button>
            {isDropdownVisible && (
                <div className={styles.dropdownMenu}>
                    {destinations.map((dest) => (
                        <div key={dest} className={styles.dropdownItem}>
                            <input
                                checked={selectedDestinations.includes(dest)}
                                type="checkbox"
                                id={`dest-${dest}`}
                                value={dest}
                                onChange={(e) => handleCheckboxChange(e)}
                            />
                            <label htmlFor={`dest-${dest}`}>{dest}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
