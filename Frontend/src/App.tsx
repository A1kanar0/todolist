import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Компоненти
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Admin from './pages/Admin';
import Auth from './pages/Auth'; // Наша нова сторінка логіну/реєстрації

// Модалки та захист
import CreateTaskModal from './components/tasks/CreateTaskModal';
import CreateNoteModal from './components/notes/CreateNoteModal';
import SettingsModal from './components/layout/SettingsModal';
import ProtectedAdminRoute from './components/layout/ProtectedAdminRoute';

// Стори
import { useTaskStore } from './store/useTaskStore';
import { useAuthStore } from './store/useAuthStore'; // Стор авторизації

// ==========================================
// 1. Компонент захисту (перевіряє чи є сесія)
// ==========================================
const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Якщо не авторизований - викидаємо на сторінку логіну
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // Якщо авторизований - рендеримо дочірні маршрути
    return <Outlet />;
};

// ==========================================
// 2. Головний макет додатку (з сайдбаром)
// ==========================================
const AppLayout = () => {
    return (
        <div className="flex h-screen bg-[#F9FAFB] dark:bg-gray-900 dark:text-gray-100 text-gray-900 font-sans overflow-hidden">
            <Sidebar />

            <div className="flex-1 p-8 overflow-hidden">
                {/* Outlet - це місце, куди підставляться Home, Tasks, Notes тощо */}
                <Outlet />
            </div>

            {/* Глобальні модальні вікна (доступні тільки всередині додатку) */}
            <CreateTaskModal />
            <CreateNoteModal/>
            <SettingsModal />
        </div>
    );
};

// ==========================================
// 3. Основний компонент App
// ==========================================
export default function App() {
    const theme = useTaskStore((state) => state.theme);
    const checkSession = useAuthStore((state) => state.checkSession);

    // Відновлюємо сесію (дістаємо токен з localStorage) при старті
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Логіка теми
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else if (theme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Публічний маршрут (на весь екран, без сайдбару) */}
                <Route path="/auth" element={<Auth />} />

                {/* Захищені маршрути */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        {/* Ці сторінки відкриються всередині <Outlet /> в AppLayout */}
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notes" element={<Notes />} />

                        {/* Подвійний захист для адміна (повинен бути і авторизованим, і адміном) */}
                        <Route element={<ProtectedAdminRoute />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
