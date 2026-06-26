import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token, assume not registered and redirect to register
    return <Navigate to="/register" replace />;
  }
  return children; // Logged in, proceed
};

export default PrivateRoute;