// RoleProtectedRoute.js
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RoleProtectedRoute = ({ children, allowedRoleId }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log("Current user in RoleProtectedRoute:", user);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (parseInt(user.Roleid) !== allowedRoleId) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
