import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import TaskItem from '../components/tasks/TaskItem';
import TaskDetails from '../components/tasks/TaskDetails';

export default function Tasks() {
    const tasks = useTaskStore((state) => state.tasks);
    const isLoading = useTaskStore((state) => state.isLoading);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);

    const selectedTask = useTaskStore((state) => state.selectedTask);
    const openCreateModal = useTaskStore((state) => state.openCreateModal);
    const isEditingTask = useTaskStore((state) => state.isEditingTask);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <span className="text-gray-500 font-medium">Завантаження завдань...</span>
                    </div>
                ) : (
                    <div className="flex flex-col pb-10">
                        {tasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>

            <div className={`bg-[#F3F4F6] rounded-2xl p-6 flex flex-col transition-all duration-300 ease-in-out ${isEditingTask ? 'w-[800px]' : 'w-96'}`}>
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
