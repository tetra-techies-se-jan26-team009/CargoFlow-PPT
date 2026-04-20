import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import AgentLogin from "./pages/Authentication/AgentLogin";
import Signup from "./pages/Authentication/SignUp";
import HomePage from "./pages/LandingPage/HomePage";
import 'leaflet/dist/leaflet.css';

import AdminDashboard from "./pages/AdminDashboards/AdminDashboard";
import ShipmentsPage from "./pages/AdminDashboards/ShipmentsPage";
import AgentsPage from "./pages/AdminDashboards/AgentsPage";
import ClientsPage from "./pages/AdminDashboards/ClientsPage";
import SettingsPage from "./pages/AdminDashboards/SettingsPage";

import ClientDashboard from "./pages/ClientDashboard/Clientdashboard";
import ClientShipments from "./pages/ClientDashboard/Clientshipments";
import ClientInvoices from "./pages/ClientDashboard/Clientinvoices";
import RequestPickup from "./pages/ClientDashboard/Requestpickup";
import ClientSettings from "./pages/ClientDashboard/Clientsetting";

import ChatbotWidget from "./components/ChatBotWidget";

import TrackingPage from './pages/TrackingPage';

import { AgentDashboard } from "./pages/AgentDashboard/AgentDashboard";
import AgentSettings from "./pages/AgentDashboard/AgentSettings";

const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRole="ADMIN">{children}</ProtectedRoute>
);

const ClientRoute = ({ children }) => (
  <ProtectedRoute allowedRole="BUSINESS_CLIENT">{children}</ProtectedRoute>
)

const AgentRoute = ({ children }) => (
  <ProtectedRoute allowedRole="DELIVERY_AGENT">{children}</ProtectedRoute>
)

export default function App() {
  return (
    <>
      <ChatbotWidget />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/partners/login" element={<AgentLogin />} />
        <Route path="/register" element={<Signup />} />


        {/* Admin Routes*/}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/shipments" element={<AdminRoute><ShipmentsPage /></AdminRoute>} />
        <Route path="/admin/agents" element={<AdminRoute><AgentsPage /></AdminRoute>} />
        <Route path="/admin/clients" element={<AdminRoute><ClientsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />

        {/* Business Client Routes */}
        <Route path="/dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
        <Route path="/shipments" element={<ClientRoute><ClientShipments /></ClientRoute>} />
        <Route path="/invoices" element={<ClientRoute><ClientInvoices /></ClientRoute>} />
        <Route path="/pickup" element={<ClientRoute><RequestPickup /></ClientRoute>} />
        <Route path="/settings" element={<ClientRoute><ClientSettings /></ClientRoute>} />

        {/* Delivery Agent Routes */}
        <Route path="/agent/dashboard" element={<AgentRoute><AgentDashboard /></AgentRoute>} />
        <Route path="/agent/profile" element={<AgentRoute><AgentSettings /></AgentRoute>} />

        {/* Tracking Route */}
        <Route path="/track/:trackingId" element={<TrackingPage />} />

        {/* Catch-all */}
        <Route path="/unauthorized" element={<div className="p-8 text-center text-red-500 text-xl">Access Denied</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}