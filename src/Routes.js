import React from "react";
import { Routes, Route } from "react-router-dom";
import MonitoringPage from "./pages/Monitoring";
import WorkloadPage from "./pages/Workload";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";
import RemarksPage from "./pages/Remarks";
import Checklist from "./pages/Checklist";
import UsefulLinks from "./pages/UsefulLinks";
import Diverted from "./pages/Diverted";



const AppRoutes = () => (
    <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }
        >
            <Route path="/" element={<MonitoringPage />} />
            <Route path="workload" element={<WorkloadPage />} />
            <Route path="remarks" element={<RemarksPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="usefulLinks" element={<UsefulLinks />} />
            <Route path="diverted" element={<Diverted />} />
        </Route>
    </Routes>
);

export default AppRoutes;
