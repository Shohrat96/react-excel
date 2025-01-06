import styles from "./App.module.css";
import JeppesenDataPage from "./pages/jepessen";
import AppRoutes from "./Routes";
import ScrollToTop from "./components/ScrollTopComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function App() {

  const pathname = window.location.pathname;

  if (pathname.startsWith('/jeppesen/')) {
    return <JeppesenDataPage />;
  }

  return (
    <>
      <AppRoutes />
      <ScrollToTop />
      <ToastContainer />
    </>
  );
}

export default App;
