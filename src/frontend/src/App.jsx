import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import DashboardFaturamento from "./pages/DashboardFaturamento";
import DashboardLojas from "./pages/DashboardLojas";
import DashboardTempo from "./pages/DashboardTempo";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/faturamento" element={<DashboardFaturamento />} />
        <Route path="/admin/lojas" element={<DashboardLojas />} />
        <Route path="/admin/tempo" element={<DashboardTempo />} />

        {/* Cliente */}
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
