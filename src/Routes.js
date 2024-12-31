import React from "react";
import { Routes, Route } from "react-router-dom";
import MonitoringPage from "./pages/Monitoring";
import WorkloadPage from "./pages/Workload";


const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<MonitoringPage />} />
        <Route path="/workload" element={<WorkloadPage />} />
    </Routes>
);

export default AppRoutes;
