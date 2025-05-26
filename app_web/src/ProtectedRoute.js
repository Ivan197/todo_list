import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const token = useSelector(state => state.auth.token);

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return <Navigate to="/login" />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
}
