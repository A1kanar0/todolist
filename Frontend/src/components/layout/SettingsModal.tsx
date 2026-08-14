import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function SettingsModal() {
    const isSettingsModalOpen = useTaskStore((state) => state.isSettingsModalOpen);
    const closeSettingsModal = useTaskStore((state) => state.closeSettingsModal);

    const theme = useTaskStore((state) => state.theme);
    const setTheme = useTaskStore((state) => state.setTheme);

    const { user, updateProfile, logout, isLoading } = useAuthStore();
    const navigate = useNavigate();

    // Стейт для форми профілю
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Стейт підтвердження пароля
    const [showPassword, setShowPassword] = useState(false); // Стейт для значка ока

    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Підтягуємо дані юзера, коли модалка відкривається
    useEffect(() => {
        if (user && isSettingsModalOpen) {
            setUsername(user.username);
            setEmail(user.email);
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false); // Скидаємо видимість пароля
            setProfileError('');
            setProfileSuccess('');
        }
    }, [user, isSettingsModalOpen]);

    if (!isSettingsModalOpen) return null;

    const getThemeButtonClass = (buttonTheme: 'light' | 'dark' | 'system') => {
        return theme === buttonTheme
            ? "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-[#A890F0] bg-purple-50 text-[#A890F0] font-semibold transition-all"
            : "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-100 hover:border-[#A890F0]/50 hover:bg-purple-50/30 text-gray-500 font-semibold transition-all";
    };

    const handleLogout = () => {
        closeSettingsModal();
        logout();
        navigate('/auth');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');

        // 1. Перевіряємо чи збігаються паролі на фронтенді
        if (password !== confirmPassword) {
            setProfileError('Паролі не збігаються. Перевірте введення.');
            return;
        }

        // 2. Відправляємо дані на бекенд
        const success = await updateProfile(username, email, password);

        if (success) {
            setProfileSuccess('Профіль успішно оновлено!');
            setPassword('');
            setConfirmPassword('');
        } else {
            setProfileError(useAuthStore.getState().error || 'Сталася помилка');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div
                className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
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

                {/* Блок: Мій профіль */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Мій профіль</h3>

                    {profileSuccess && <div className="p-2 bg-green-50 text-green-700 text-sm rounded-lg font-semibold">{profileSuccess}</div>}
                    {profileError && <div className="p-2 bg-red-50 text-red-700 text-sm rounded-lg font-semibold">{profileError}</div>}

                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Ім'я користувача</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0]"
                                required
                            />
                        </div>

                        {/* Блок з паролем */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-bold text-gray-700">
                                    Пароль (поточний або новий)
                                </label>
                                {/* Кнопка ока для перемикання видимості */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs text-gray-500 hover:text-[#A890F0] font-semibold flex items-center gap-1 transition-colors"
                                >
                                    {showPassword ? (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18m-1.5-1.5a10.05 10.05 0 001.5-1.5c-1.275-4.057-5.064-7-9.542-7-1.274 0-2.48.24-3.578.675" /></svg>
                                            Приховати
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            Показати
                                        </>
                                    )}
                                </button>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введіть пароль..."
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0]"
                                required
                            />
                        </div>

                        {/* Підтвердження пароля */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Підтвердіть пароль
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Повторіть пароль..."
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword}
                            className="mt-2 w-full py-2.5 bg-[#A890F0] hover:bg-[#8F75E0] text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                        </button>
                    </form>
                </div>

                {/* Блок: Фільтри головної сторінки */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Фільтри</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-semibold text-gray-700 text-sm">Сортування завдань</span>
                        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-1.5 outline-none cursor-pointer">
                            <option value="deadline">Найближчі</option>
                            <option value="priority">Пріоритетні</option>
                            <option value="newest">Нові</option>
                        </select>
                    </div>
                </div>

                {/* Блок: Тема сайту */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Зовнішній вигляд</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => setTheme('light')} className={getThemeButtonClass('light')}>
                            <span>☀️</span><span className="text-xs">Світла</span>
                        </button>
                        <button onClick={() => setTheme('dark')} className={getThemeButtonClass('dark')}>
                            <span>🌙</span><span className="text-xs">Темна</span>
                        </button>
                        <button onClick={() => setTheme('system')} className={getThemeButtonClass('system')}>
                            <span>💻</span><span className="text-xs">Системна</span>
                        </button>
                    </div>
                </div>

                {/* Блок: Дії акаунта */}
                <div className="pt-4 border-t border-gray-100 mt-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Вийти з акаунта
                    </button>
                </div>
            </div>
        </div>
    );
}
