import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, children }) {
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // If a specific role is required and user role doesn't match, redirect to Home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}