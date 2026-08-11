import { create } from 'zustand';

interface AuthStore {
    userRole: 'admin' | 'user';
    // В майбутньому тут будуть:
    // token: string | null;
    // user: UserProfile | null;
    // login: (data) => void;
    // logout: () => void;
}

// Замість (set) => залишаємо порожні дужки () =>
export const useAuthStore = create<AuthStore>(() => ({
    userRole: 'admin', // Наша заглушка
}));
