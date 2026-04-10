import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute({ children }) {
  const { userInfo } = useAuth();
  return userInfo ? children : <Navigate to="/login" replace />;
}