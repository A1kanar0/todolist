import { useTaskStore } from '../store/useTaskStore';
import TaskItem, { type TaskNode } from '../components/tasks/TaskItem.tsx';
import TaskDetails from '../components/tasks/TaskDetails';

export default function Tasks() {
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const openCreateModal = useTaskStore((state) => state.openCreateModal);

    const mockTasksTree: TaskNode[] = [
        {
            id: '1',
            title: 'Розробити фронтенд',
            text: 'Налаштувати React, Tailwind, та базовий Layout сторінки.',
            status: 'in-progress',
            deadlineDays: 1,
            category: 'Development',
            children: [
                {
                    id: '1-1',
                    title: 'Зверстати Sidebar',
                    text: 'Додати логотип, навігацію та активні стани для NavLink.',
                    status: 'done',
                    category: 'UI/UX',
                },
                {
                    id: '1-2',
                    title: 'Зробити сторінку Tasks',
                    text: 'Реалізувати рекурсивний компонент для нескінченної вкладеності тасок.',
                    status: 'in-progress',
                    deadlineDays: 5,
                    category: 'Development',
                    children: [
                        {
                            id: '1-2-1',
                            title: 'Придумати візуал "ниток"',
                            text: 'Використати border-l та відступи для відображення ієрархії.',
                            status: 'todo',
                            deadlineDays: 0,
                            category: 'Design',
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            title: 'Інтеграція з бекендом',
            text: 'Підключити Axios та написати сервіси для API.',
            status: 'todo',
            deadlineDays: 3,
            category: 'API',
        }
    ];

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Tasks List</h1>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xl leading-none">+</span> Add task
                    </button>
                </div>

                <div className="flex flex-col pb-10">
                    {mockTasksTree.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>

            <div className="w-96 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
                </div>

                <TaskDetails task={selectedTask} />
            </div>
        </div>
    );
}
