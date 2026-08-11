import { NavLink, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/useTaskStore';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

export default function Sidebar() {
    const openSettingsModal = useTaskStore((state) => state.openSettingsModal);

    // Дістаємо роль юзера з нашого нового AuthStore
    const userRole = useAuthStore((state) => state.userRole);
    const navigate = useNavigate();

    // Динамічні класи для верхнього меню (стиль активної кнопки як на скріні)
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            isActive
                ? 'bg-[#A890F0] text-white shadow-sm' // Суцільний фіолетовий фон і білий текст
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`;

    return (
        <div className="w-64 h-full bg-white dark:bg-gray-900 dark:text-gray-100 border-r border-gray-200 flex flex-col justify-between p-6">

            {/* Верхня частина: Логотип та Навігація */}
            <div className="flex flex-col gap-8">

                {/* Логотип */}
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight px-4">
                    Todolisy<span className="text-[#A890F0]">.</span>
                </div>

                {/* Основне меню сторінок */}
                <nav className="flex flex-col gap-2">
                    <NavLink to="/" className={navLinkClass}>
                        <span className="text-xl">🏠</span> Home
                    </NavLink>
                    <NavLink to="/tasks" className={navLinkClass}>
                        <span className="text-xl">✅</span> Tasks
                    </NavLink>
                    <NavLink to="/notes" className={navLinkClass}>
                        <span className="text-xl">📝</span> Notes
                    </NavLink>
                </nav>
            </div>

            {/* Нижнє меню з нашими новими UI-компонентами */}
            <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-gray-100">
                <Button variant="sidebar" icon="☁️">
                    Google Drive
                </Button>

                {/* Умовний рендер кнопки адмінки: показуємо тільки якщо роль 'admin' */}
                {userRole === 'admin' && (
                    <Button variant="sidebar" icon="🛡️" onClick={() => navigate('/admin')}>
                        Admin
                    </Button>
                )}

                <Button variant="sidebar" icon="⚙️" onClick={openSettingsModal}>
                    Settings
                </Button>
            </div>

        </div>
    );
}
