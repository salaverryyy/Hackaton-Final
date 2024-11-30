import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token; // Verifica si el token existe
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
  }
  return children;
};

export default ProtectedRoute;
