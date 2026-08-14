import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
    // Стан для перемикання між Логіном та Реєстрацією
    const [isLogin, setIsLogin] = useState(true);

    // Дані форми
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            // Логіка входу
            const success = await login(email, password);
            if (success) navigate('/');
        } else {
            // Логіка реєстрації
            const registerSuccess = await register(username, email, password);
            if (registerSuccess) {
                // Одразу логінимо після успішної реєстрації
                const loginSuccess = await login(email, password);
                if (loginSuccess) navigate('/');
            }
        }
    };

    // Очищаємо форму при перемиканні режимів
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md transition-all duration-300">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    {isLogin ? 'Вхід' : 'Реєстрація'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Поле Username показуємо ТІЛЬКИ при реєстрації */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ім'я користувача</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                                placeholder="Artem"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                            placeholder="mail@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 bg-[#A890F0] hover:bg-[#8F75E0] text-white font-bold rounded-xl transition-colors disabled:opacity-70"
                    >
                        {isLoading
                            ? 'Завантаження...'
                            : isLogin ? 'Увійти' : 'Створити акаунт'
                        }
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-semibold text-gray-500">
                    {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="ml-2 text-[#A890F0] hover:text-[#8F75E0] transition-colors focus:outline-none"
                    >
                        {isLogin ? 'Зареєструватися' : 'Увійти'}
                    </button>
                </div>
            </div>
        </div>
    );
}
