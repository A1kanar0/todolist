import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedAdminRoute() {
    const userRole = useAuthStore((state) => state.userRole);

    // Якщо роль не адмін — перенаправляємо на головну сторінку
    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
