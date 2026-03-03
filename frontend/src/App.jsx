import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/SignUp";
import HomePage from "./pages/LandingPage/HomePage";

import AdminDashboard from "./pages/Dashboards/AdminDashboard";
// import AgentDashboard from "./pages/dashboards/AgentDashboard";
// import ClientDashboard from "./pages/dashboards/ClientDashboard";

export default function App() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Dashboard routes — uncomment when dashboard files are created */}
      <Route path="/auth_admin/dashboard" element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

      {/* <Route path="/auth_agent/dashboard" element={
            <ProtectedRoute allowedRole="DELIVERY_AGENT">
              <AgentDashboard />
            </ProtectedRoute>
          } /> */}

      {/* <Route path="/auth_client/dashboard" element={
            <ProtectedRoute allowedRole="BUSINESS_CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          } /> */}

      <Route path="/unauthorized" element={
        <div className="p-8 text-center text-red-500 text-xl">Access Denied</div>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

  );
}