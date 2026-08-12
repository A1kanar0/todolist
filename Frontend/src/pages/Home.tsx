import { useNavigate } from 'react-router-dom';
import { useTaskStore, type TaskNode } from '../store/useTaskStore';
import TaskItem from '../components/tasks/TaskItem';
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
            deadline: new Date(Date.now() + 86400000).toISOString(), // +1 день
            categoryId: 'Management'
        },
        {
            id: '1',
            title: 'Розробити фронтенд',
            text: 'Налаштувати React, Tailwind, та базовий Layout сторінки.',
            status: 'in-progress',
            deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 дні
            categoryId: 'Development'
        },
        {
            id: '2',
            title: 'Інтеграція з бекендом',
            text: 'Підключити Axios та написати сервіси для API.',
            status: 'todo',
            deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // +5 днів
            categoryId: 'API'
        }
    ];

    const sortedTasks = [...homeTasks].sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return dateA - dateB;
    });

    return (
        <div className="flex gap-8 h-full">

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

            <div className="w-80 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notes</h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[]}
                        onClick={() => navigate('/notes')}
                    />
                </div>

                <button className="mt-6 w-full py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span className="text-xl">+</span> Add note
                </button>
            </div>

        </div>
    );
}
