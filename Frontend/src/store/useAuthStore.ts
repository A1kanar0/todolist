import { create } from 'zustand';
import { fetchGraphQL } from '../utils/api'; // <--- Імпортуємо наш клієнт

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    updateProfile: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkSession: () => void;
}

const savedToken = localStorage.getItem('token');
const savedUserStr = localStorage.getItem('user');

let initialUser = null;
if (savedUserStr) {
    try {
        initialUser = JSON.parse(savedUserStr);
    } catch (e) {
        console.error("Помилка парсингу користувача", e);
    }
}

// Прибрали (set, get), залишили тільки (set), бо токен тепер тягнеться автоматично в api.ts
export const useAuthStore = create<AuthStore>((set) => ({
    user: initialUser,
    token: savedToken,
    isAuthenticated: !!(savedToken && initialUser),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const query = `
                mutation Login($input: LoginInput!) {
                    login(input: $input) {
                        token
                        user { id username email }
                    }
                }
            `;

            const data = await fetchGraphQL(query, { input: { email, password } });
            const { token, user } = data.login;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({ user, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const query = `
                mutation CreateUser($input: CreateUserInput!) {
                    createUser(input: $input) { id username email }
                }
            `;

            await fetchGraphQL(query, { input: { username, email, password } });

            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    updateProfile: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const query = `
                mutation UpdateUser($input: UpdateUserInput!) {
                    updateUser(input: $input) { id username email }
                }
            `;

            const data = await fetchGraphQL(query, { input: { username, email, password } });
            const updatedUser = data.updateUser;

            // Оновлюємо дані в пам'яті браузера
            localStorage.setItem('user', JSON.stringify(updatedUser));

            set({ user: updatedUser, isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkSession: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            set({ token, user: JSON.parse(userStr), isAuthenticated: true });
        }
    }
}));
