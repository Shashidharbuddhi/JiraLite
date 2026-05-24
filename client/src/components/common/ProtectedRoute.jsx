import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const ProtectedRoute = () => {
  const { token, bootstrapping } = useSelector((state) => state.auth);
  const location = useLocation();

  if (bootstrapping) return <Loader label="Checking session" />;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
