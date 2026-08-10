import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import CreateTaskModal from './components/tasks/CreateTaskModal';
import SettingsModal from './components/layout/SettingsModal';
import { useTaskStore } from './store/useTaskStore';

export default function App() {
    // Дістаємо поточну тему зі стора
    const theme = useTaskStore((state) => state.theme);

    // Цей ефект спрацьовує щоразу, коли змінюється тема
    useEffect(() => {
        const root = document.documentElement; // Це наш тег <html>

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else if (theme === 'system') {
            // Перевіряємо системні налаштування користувача
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme]);

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-[#F9FAFB] dark:bg-gray-900 dark:text-gray-100 text-gray-900 font-sans overflow-hidden">
                <Sidebar />

                <div className="flex-1 p-8 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notes" element={<Notes />} />
                    </Routes>
                </div>
            </div>

            {/* Глобальні модальні вікна */}
            <CreateTaskModal />
            <SettingsModal />
        </BrowserRouter>
    );
}
