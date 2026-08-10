import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import TaskItem, { type TaskNode } from '../components/tasks/TaskItem';
import NoteCard from '../components/notes/NoteCard.tsx';

export default function Home() {
    const navigate = useNavigate();
    const openCreateModal = useTaskStore((state) => state.openCreateModal);

    // Фейкові дані для перевірки візуалу
    const homeTasks: TaskNode[] = [
        {
            id: '3',
            title: 'Підготувати реліз',
            text: 'Перевірити всі баги перед пушем на прод.',
            status: 'todo',
            deadlineDays: 0,
            category: 'Management'
        },
        {
            id: '1',
            title: 'Розробити фронтенд',
            text: 'Налаштувати React, Tailwind, та базовий Layout сторінки.',
            status: 'in-progress',
            deadlineDays: 1,
            category: 'Development'
        },
        {
            id: '2',
            title: 'Інтеграція з бекендом',
            text: 'Підключити Axios та написати сервіси для API.',
            status: 'todo',
            deadlineDays: 5,
            category: 'API'
        }
    ];

    // Сортуємо таски за дедлайном
    const sortedTasks = [...homeTasks].sort((a, b) => (a.deadlineDays || 0) - (b.deadlineDays || 0));

    return (
        <div className="flex gap-8 h-full">

            {/* Головна колонка з тасками (займає більшу частину) */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Home</h1>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xl leading-none">+</span> Add task
                    </button>
                </div>

                <div className="flex flex-col pb-10">
                    {sortedTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            hideChildren={true}
                            onNavigate={() => navigate('/tasks')}
                        />
                    ))}
                </div>
            </div>

            {/* Права панель з нотатками */}
            <div className="w-80 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notes</h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[
                            { label: '#tag2', color: 'bg-purple-200 text-purple-800' },
                            { label: '#tag1', color: 'bg-yellow-200 text-yellow-800' }
                        ]}
                    />
                </div>

                <button className="mt-6 w-full py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span className="text-xl">+</span> Add note
                </button>
            </div>

        </div>
    );
}
