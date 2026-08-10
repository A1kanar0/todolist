import { useTaskStore } from '../../store/useTaskStore';

export default function SettingsModal() {
    const isSettingsModalOpen = useTaskStore((state) => state.isSettingsModalOpen);
    const closeSettingsModal = useTaskStore((state) => state.closeSettingsModal);

    // Дістаємо стан теми
    const theme = useTaskStore((state) => state.theme);
    const setTheme = useTaskStore((state) => state.setTheme);

    if (!isSettingsModalOpen) return null;

    // Допоміжна функція для динамічних класів кнопок теми
    const getThemeButtonClass = (buttonTheme: 'light' | 'dark' | 'system') => {
        return theme === buttonTheme
            ? "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-[#A890F0] bg-purple-50 text-[#A890F0] font-semibold transition-all"
            : "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-100 hover:border-[#A890F0]/50 hover:bg-purple-50/30 text-gray-500 font-semibold transition-all";
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div
                className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-extrabold text-gray-800">Налаштування</h2>
                    <button
                        onClick={closeSettingsModal}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Блок: Фільтри головної сторінки */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Фільтри головної сторінки</h3>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-semibold text-gray-700">Сортування завдань</span>
                        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2 outline-none cursor-pointer">
                            <option value="deadline">За найближчим дедлайном</option>
                            <option value="priority">За пріоритетом</option>
                            <option value="newest">Спочатку нові</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-semibold text-gray-700">Ховати виконані (Done)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A890F0]"></div>
                        </label>
                    </div>
                </div>

                {/* Блок: Тема сайту */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Зовнішній вигляд</h3>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setTheme('light')}
                            className={getThemeButtonClass('light')}
                        >
                            <span>☀️</span>
                            <span className="text-sm">Світла</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={getThemeButtonClass('dark')}
                        >
                            <span>🌙</span>
                            <span className="text-sm">Темна</span>
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={getThemeButtonClass('system')}
                        >
                            <span>💻</span>
                            <span className="text-sm">Системна</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
