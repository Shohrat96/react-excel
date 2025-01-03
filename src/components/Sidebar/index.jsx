import React, { useState } from "react";
import styles from "./Sidebar.module.css"; // Importing CSS module

// Sample icons (you can replace these with your desired icons)
import { FaPlane, FaTachometerAlt, FaTimes } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { Link } from "react-router-dom";

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
        <Link to="/">
          <li className={styles.menuItem}>

            <FaTachometerAlt className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Monitoring</span>}
          </li>
        </Link>
        <Link to="/workload">
          <li className={styles.menuItem}>
            <FaPlane className={styles.icon} />
            {!collapsed && <span className={styles.menuTitle}>Workload</span>}
          </li>
        </Link>

      </ul>
    </div>
  );
};

export default Sidebar;
