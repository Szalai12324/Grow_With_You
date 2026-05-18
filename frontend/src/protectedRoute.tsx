import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user) {
        // Nincs bejelentkezve -> Irány a Login!
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'ADMIN') {
        // Be van jelentkezve, de nem Admin -> Irány a Vásárlói oldal!
        alert("Ehhez az oldalhoz nincs jogosultságod!");
        return <Navigate to="/customer" replace />;
    }

    // Ha mindenen átment, megmutatjuk az oldalt (children)
    return <>{children}</>;
};

export default ProtectedRoute;