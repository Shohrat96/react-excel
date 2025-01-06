import React from "react";
import { Routes, Route } from "react-router-dom";
import MonitoringPage from "./pages/Monitoring";
import WorkloadPage from "./pages/Workload";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";


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
            <Route path="profile" element={<Profile />} />
        </Route>
    </Routes>
);

export default AppRoutes;
