import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";  // ✅ correct path

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;