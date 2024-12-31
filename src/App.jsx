import { useState } from "react";
import styles from "./App.module.css";
import Sidebar from "./components/Sidebar";
import HeaderControls from "./components/HeaderControls";
import ScrollToTop from "./components/ScrollTopComponent";
import JeppesenDataPage from "./pages/jepessen";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";



function App() {

  const [collapsed, setCollapsed] = useState(false)

  const pathname = window.location.pathname;


  if (pathname.startsWith('/jeppesen/')) {
    // Render the Jeppesen data page based on the current URL
    return <JeppesenDataPage />;
  }

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`${styles.main} ${collapsed ? styles.collapsed : ""}`}>
          <HeaderControls />
          <AppRoutes />
        </div>
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
