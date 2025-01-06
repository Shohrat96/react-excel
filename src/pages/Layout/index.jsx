import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import HeaderControls from "../../components/HeaderControls";
import styles from "./Layout.module.css";
import { useState } from "react";

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`${styles.main} ${collapsed ? styles.collapsed : ""}`}>
                <HeaderControls />
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
