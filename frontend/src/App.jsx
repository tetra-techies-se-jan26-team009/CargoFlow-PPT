// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Authentication/Login";
// import Signup from "./pages/Authentication/SignUp";
// import HomePage from "./pages/LandingPage/HomePage";

// import AdminDashboard from "./pages/Dashboards/AdminDashboard";
// import ShipmentsPage from "./pages/dashboards/ShipmentsPage";
// import AgentsPage from "./pages/dashboards/AgentsPage";
// import ClientsPage from "./pages/dashboards/ClientsPage";
// import ReportsPage from "./pages/dashboards/ReportsPage";
// import SettingsPage from "./pages/dashboards/SettingsPage";
// // import AgentDashboard from "./pages/dashboards/AgentDashboard";
// // import ClientDashboard from "./pages/dashboards/ClientDashboard";

// export default function App() {
//   return (

//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Signup />} />

//       {/* Dashboard routes — uncomment when dashboard files are created */}
//       <Route path="/auth_admin/dashboard" element={
//         <ProtectedRoute allowedRole="ADMIN">
//           <AdminDashboard />
//           <Route path="/auth_admin/shipments" element={<ProtectedRoute allowedRole="ADMIN"><ShipmentsPage /></ProtectedRoute>} />
//           <Route path="/auth_admin/agents" element={<ProtectedRoute allowedRole="ADMIN"><AgentsPage /></ProtectedRoute>} />
//           <Route path="/auth_admin/clients" element={<ProtectedRoute allowedRole="ADMIN"><ClientsPage /></ProtectedRoute>} />
//           <Route path="/auth_admin/reports" element={<ProtectedRoute allowedRole="ADMIN"><ReportsPage /></ProtectedRoute>} />
//           <Route path="/auth_admin/settings" element={<ProtectedRoute allowedRole="ADMIN"><SettingsPage /></ProtectedRoute>} />
//         </ProtectedRoute>
//       } />

//       {/* <Route path="/auth_agent/dashboard" element={
//             <ProtectedRoute allowedRole="DELIVERY_AGENT">
//               <AgentDashboard />
//             </ProtectedRoute>
//           } /> */}

//       {/* <Route path="/auth_client/dashboard" element={
//             <ProtectedRoute allowedRole="BUSINESS_CLIENT">
//               <ClientDashboard />
//             </ProtectedRoute>
//           } /> */}

//       <Route path="/unauthorized" element={
//         <div className="p-8 text-center text-red-500 text-xl">Access Denied</div>
//       } />

//       {/* Catch-all */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>

//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/SignUp";
import HomePage from "./pages/LandingPage/HomePage";

import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import ShipmentsPage  from "./pages/dashboards/ShipmentsPage";
import AgentsPage     from "./pages/dashboards/AgentsPage";
import ClientsPage    from "./pages/dashboards/ClientsPage";
import ReportsPage    from "./pages/dashboards/ReportsPage";
import SettingsPage   from "./pages/dashboards/SettingsPage";

const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRole="ADMIN">{children}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Admin — all flat, each individually protected */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/shipments" element={<AdminRoute><ShipmentsPage /></AdminRoute>} />
      <Route path="/admin/agents"    element={<AdminRoute><AgentsPage /></AdminRoute>} />
      <Route path="/admin/clients"   element={<AdminRoute><ClientsPage /></AdminRoute>} />
      <Route path="/admin/reports"   element={<AdminRoute><ReportsPage /></AdminRoute>} />
      <Route path="/admin/settings"  element={<AdminRoute><SettingsPage /></AdminRoute>} />

      {/* Catch-all */}
      <Route path="/unauthorized" element={<div className="p-8 text-center text-red-500 text-xl">Access Denied</div>} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
}