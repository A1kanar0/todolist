import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    // Функція для стилізації активного та неактивного пунктів меню
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center justify-between p-3 mb-2 rounded-xl transition-colors font-semibold ${
            isActive
                ? 'bg-[#8B78CC] text-white'
                : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <aside className="w-64 h-full bg-[#F8F9FA] flex flex-col border-r border-gray-200">
            {/* Логотип */}
            <div className="p-8 font-bold text-2xl text-gray-900 tracking-wide">
                LOGO & NAME
            </div>

            {/* Основна навігація */}
            <nav className="flex-1 px-4 mt-2">
                <NavLink to="/" className={navLinkClasses}>
                    <span>Home</span>
                    <span className="text-sm">7</span>
                </NavLink>
                <NavLink to="/tasks" className={navLinkClasses}>
                    <span>Tasks</span>
                    <span className="text-sm">12</span>
                </NavLink>
                <NavLink to="/notes" className={navLinkClasses}>
                    <span>Notes</span>
                    <span className="text-sm">5</span>
                </NavLink>
            </nav>

            {/* Нижнє меню */}
            <div className="p-4 mb-4 text-gray-700 font-semibold">
                <button className="flex items-center w-full p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <span>Google Drive</span>
                </button>
                <button className="flex items-center w-full p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <span>Admin panel</span>
                </button>
                <button className="flex items-center w-full p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
