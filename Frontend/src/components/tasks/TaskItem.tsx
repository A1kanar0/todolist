import { useState } from 'react';
import { useTaskStore, type TaskNode } from '../../store/useTaskStore';

interface NestedTaskItemProps {
    task: TaskNode;
    depth?: number;
    hideChildren?: boolean;
    onNavigate?: (task: TaskNode) => void;
}

const isDeadlineNearOrOverdue = (dateString?: string) => {
    if (!dateString) return false;
    const deadlineDate = new Date(dateString).getTime();
    return (deadlineDate - Date.now()) / (1000 * 60 * 60) < 24;
};

const stripHtml = (html?: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

export default function TaskItem({ task, depth = 0, hideChildren = false, onNavigate }: NestedTaskItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = task.children && task.children.length > 0;

    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
    const selectedTask = useTaskStore((state) => state.selectedTask);

    const categories = useTaskStore((state) => state.categories);
    const users = useTaskStore((state) => state.users);

    const isSelected = selectedTask?.id === task.id;
    const isDone = task.status === 'done';

    const categoryName = categories.find(c => String(c.id) === String(task.categoryId))?.name;
    const executorUsers = users.filter(u => task.executorIds?.includes(String(u.id)));

    const statusColors = {
        'todo': 'bg-gray-200 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        // Зробили бейдж виконаного завдання сірим замість зеленого
        'done': 'bg-gray-200 text-gray-600',
    };

    return (
    <div className={`mt-3 ${depth > 0 ? `border-l-2 pl-4 ml-2 ${isDone ? 'border-gray-300' : 'border-[#A890F0]/40'}` : ''}`}>
        <div
            onClick={() => {
                setSelectedTask(task);
                if (onNavigate) onNavigate(task);
            }}
            className={`p-4 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer group ${
                isSelected ? 'bg-purple-50/50 border-2 border-[#A890F0]' :
                    isDone ? 'bg-gray-50 border-gray-200 hover:border-gray-300' :
                        'bg-white border-gray-200 hover:border-[#A890F0]'
            }`}
        >
            <div className="flex justify-between items-start mb-2 gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {hasChildren && !hideChildren && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                            className={`p-1 -ml-1 rounded hover:bg-gray-200 transition-colors shrink-0 ${isDone ? 'text-gray-400' : 'text-gray-400 hover:text-gray-700'}`}
                            title={isOpen ? "Згорнути" : "Розгорнути"}
                        >
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    <span className={`font-bold transition-colors truncate ${
                        isDone ? 'line-through text-gray-500' :
                            isSelected ? 'text-[#A890F0]' :
                                'text-gray-900 group-hover:text-[#7E69AB]'
                    }`} title={task.title}>
                            {task.title}
                        </span>
                </div>

                {/* Бейджі злегка приглушуються через text-gray-500 для виконаних */}
                <div className="flex items-center gap-2 shrink-0 max-w-[60%] justify-end">
                    {categoryName && (
                        <span className="text-gray-500 text-xs border border-gray-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[120px]">
                                <span className="shrink-0">📁</span>
                                <span className="truncate">{categoryName}</span>
                            </span>
                    )}
                    {executorUsers.length > 0 && (
                        <span
                            className="text-gray-500 text-xs border border-gray-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[150px]"
                            title={executorUsers.map(u => u.username).join(', ')}
                        >
                                <span className="shrink-0">👤</span>
                                <span className="truncate">{executorUsers.map(u => u.username).join(', ')}</span>
                            </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                </div>
            </div>

            <div className="flex justify-between items-end mt-1 gap-4">
                {/* Опис без закреслення, просто сірий */}
                <p className={`text-sm line-clamp-2 ${isDone ? 'text-gray-500' : 'text-gray-600'}`}>
                    {stripHtml(task.text)}
                </p>

                {task.deadline && (
                    <span className={`text-xs font-bold whitespace-nowrap shrink-0 ${
                        isDone ? 'text-gray-400' :
                            isDeadlineNearOrOverdue(task.deadline) ? 'text-red-500' : 'text-gray-400'
                    }`}>
                            {new Date(task.deadline).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                )}
            </div>
        </div>

        {hasChildren && isOpen && !hideChildren && (
            <div className="children-container">
                {task.children?.map((childTask) => (
                    <TaskItem key={childTask.id} task={childTask} depth={depth + 1} hideChildren={hideChildren} onNavigate={onNavigate} />
                ))}
            </div>
        )}
    </div>
);
}
