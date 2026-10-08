import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const auth = sessionStorage.getItem('zauth');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}