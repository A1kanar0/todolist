import { useEffect, useState, useMemo } from 'react';
import { useTaskStore, type TaskNode } from '../store/useTaskStore';
import TaskItem from '../components/tasks/TaskItem';
import TaskDetails from '../components/tasks/TaskDetails';
import SearchInput from '../components/ui/SearchInput';

// Рекурсивна перевірка: чи виконане завдання і ВСІ його підзавдання
const isTreeCompleted = (node: TaskNode): boolean => {
    if (node.status !== 'done') return false;
    if (node.children && node.children.length > 0) {
        return node.children.every(isTreeCompleted);
    }
    return true;
};

export default function Tasks() {
    const tasks = useTaskStore((state) => state.tasks);
    const isLoading = useTaskStore((state) => state.isLoading);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);

    const categories = useTaskStore((state) => state.categories);
    const users = useTaskStore((state) => state.users);

    const selectedTask = useTaskStore((state) => state.selectedTask);
    const openCreateModal = useTaskStore((state) => state.openCreateModal);
    const isEditingTask = useTaskStore((state) => state.isEditingTask);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterExecutor, setFilterExecutor] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = useMemo(() => {
        const filterNodes = (nodes: TaskNode[]): TaskNode[] => {
            return nodes.reduce((acc: TaskNode[], task) => {
                const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = filterCategory ? String(task.categoryId) === filterCategory : true;
                const matchesExecutor = filterExecutor ? task.executorIds?.includes(filterExecutor) : true;
                const matchesStatus = filterStatus !== 'all' ? task.status === filterStatus : true;

                const isMatch = matchesSearch && matchesCategory && matchesExecutor && matchesStatus;
                const filteredChildren = task.children ? filterNodes(task.children) : [];

                if (isMatch || filteredChildren.length > 0) {
                    acc.push({ ...task, children: filteredChildren });
                }
                return acc;
            }, []);
        };

        const result = filterNodes(tasks);

        return result.sort((a, b) => {
            const aDone = isTreeCompleted(a);
            const bDone = isTreeCompleted(b);

            if (aDone === bDone) return 0;
            return aDone ? 1 : -1;
        });
    }, [tasks, searchQuery, filterCategory, filterExecutor, filterStatus]);

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight shrink-0">Tasks List</h1>

                    {/* Блок фільтрів по центру */}
                    <div className="flex flex-1 justify-center gap-2">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search tasks..."
                            className="w-48"
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A890F0] shadow-sm cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                        </select>
                        <select
                            value={filterExecutor}
                            onChange={(e) => setFilterExecutor(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A890F0] shadow-sm cursor-pointer"
                        >
                            <option value="">All Executors</option>
                            {users.map(u => <option key={u.id} value={String(u.id)}>{u.username}</option>)}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A890F0] shadow-sm cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0"
                    >
                        <span className="text-xl leading-none">+</span> Add task
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <span className="text-gray-500 font-medium">Завантаження завдань...</span>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="flex flex-col">
                            {filteredTasks.map(task => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                            <span className="text-gray-400 font-medium">No tasks found matching your filters</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={`bg-[#F3F4F6] rounded-2xl p-6 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${isEditingTask ? 'w-[800px]' : 'w-[400px]'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditingTask ? 'Edit Task' : 'Task Details'}
                    </h2>
                </div>

                <TaskDetails task={selectedTask} />
            </div>
        </div>
    );
}
