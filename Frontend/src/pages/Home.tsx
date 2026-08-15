import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore, type TaskNode } from '../store/useTaskStore';
import TaskItem from '../components/tasks/TaskItem';
import NoteCard from '../components/notes/NoteCard.tsx';

export default function Home() {
    const navigate = useNavigate();
    const openCreateModal = useTaskStore((state) => state.openCreateModal);

    const tasksTree = useTaskStore((state) => state.tasks);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const isLoading = useTaskStore((state) => state.isLoading);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Розгортаємо дерево в плоский список, відсіюємо виконані і сортуємо по дедлайнам
    const sortedTasks = useMemo(() => {
        const flattenTasks = (nodes: TaskNode[]): TaskNode[] => {
            let result: TaskNode[] = [];
            nodes.forEach(node => {
                result.push(node);
                if (node.children && node.children.length > 0) {
                    result = result.concat(flattenTasks(node.children));
                }
            });
            return result;
        };

        const flatTasks = flattenTasks(tasksTree);

        // Фільтруємо виконані завдання та сортуємо за дедлайном
        return flatTasks
            .filter(task => task.status !== 'done')
            .sort((a, b) => {
                const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return dateA - dateB;
            });
    }, [tasksTree]);

    return (
        <div className="flex gap-8 h-full">

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Home</h1>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xl leading-none">+</span> Add task
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <span className="text-gray-500 font-medium">Завантаження завдань...</span>
                        </div>
                    ) : sortedTasks.length > 0 ? (
                        <div className="flex flex-col">
                            {sortedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    hideChildren={true}
                                    onNavigate={() => navigate('/tasks')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-200 rounded-xl">
                            <span className="text-gray-400 font-medium">No active tasks</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-80 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notes</h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[
                            { name: '#tag2', color: 'bg-purple-200 text-purple-800' },
                            { name: '#tag1', color: 'bg-yellow-200 text-yellow-800' }
                        ]}
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
