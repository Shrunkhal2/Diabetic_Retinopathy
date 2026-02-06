import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();

  // Allow access to login without auth
  if (!isAuthenticated && location.pathname === '/login') {
    return <Outlet />;
  }

  // Block all other routes if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;