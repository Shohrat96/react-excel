import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "./ProfileAvatar.module.css";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../redux/slice/authSlice";

export default function ProfileAvatar() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()

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

    const handleNavigate = (path) => {
        setIsDropdownVisible(false); // Close the dropdown
        navigate(path);
    };

    return (
        <div
            className={styles.container}
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownVisible(true)}
            onMouseLeave={() => setIsDropdownVisible(false)}
        >
            <div className={styles.icon}>
                <FaUserCircle color="#2c3e50" size="32px" />
            </div>
            {isDropdownVisible && (
                <div className={styles.dropdown}>
                    <ul>
                        <li onClick={() => handleNavigate("/profile")}>Profile</li>
                        <li onClick={() => dispatch(logoutAsync())}>Logout</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
