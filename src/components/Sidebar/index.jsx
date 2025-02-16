import React from "react";
import styles from "./Sidebar.module.css"; // Importing CSS module

// Sample icons (you can replace these with your desired icons)
import { FaPlane, FaCommentDots } from "react-icons/fa";
import { FaTachometerAlt, FaListAlt, FaLink } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && <h2 className={styles.title}>AZAL - Flight Dispatch</h2>}
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          {collapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </button>
      </div>
      <ul className={styles.menu}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} >
          <li className={styles.menuListItem}>
            <FaTachometerAlt className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Monitoring</span>}
          </li>
        </NavLink>
        <NavLink to="/workload" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          <li className={styles.menuListItem}>
            <FaPlane className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Workload</span>}
          </li>
        </NavLink>
        <NavLink to="/remarks" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          <li className={styles.menuListItem}>
            <FaCommentDots className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Remarks</span>}
          </li>
        </NavLink>

        <NavLink to="/checklist" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          <li className={styles.menuListItem}>
            <FaListAlt className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Handover</span>}
          </li>
        </NavLink>
        <NavLink to="/usefulLinks" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
          <li className={styles.menuListItem}>
            <FaLink className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Useful Links</span>}
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
