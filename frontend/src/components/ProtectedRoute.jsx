import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// blocks access to a page and redirects to login if no user is logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
