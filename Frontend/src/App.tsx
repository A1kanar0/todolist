import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import CreateTaskModal from './components/tasks/CreateTaskModal';

export default function App() {
    return (
        <BrowserRouter>
            <CreateTaskModal />
            {/* Головний контейнер на весь екран */}
            <div className="flex h-screen bg-[#F8F9FA] text-gray-900 font-sans">

                {/* Наш статичний сайдбар */}
                <Sidebar />

                {/* Центральна динамічна частина */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notes" element={<Notes />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}
