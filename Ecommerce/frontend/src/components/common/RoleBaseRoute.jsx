import { Navigate } from "react-router-dom";
import { getUserRole } from "../common/Http";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;