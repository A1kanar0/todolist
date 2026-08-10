import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';

export interface TaskNode {
    id: string;
    title: string;
    text: string;
    status: 'todo' | 'in-progress' | 'done';
    children?: TaskNode[];
    deadlineDays?: number;
    category?: string;
}

interface NestedTaskItemProps {
    task: TaskNode;
    depth?: number;
    hideChildren?: boolean;
    onNavigate?: (task: TaskNode) => void;
}

export default function TaskItem({ task, depth = 0, hideChildren = false, onNavigate }: NestedTaskItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = task.children && task.children.length > 0;
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);

    const statusColors = {
        'todo': 'bg-gray-200 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'done': 'bg-green-100 text-green-700',
    };

    return (
        <div className={`mt-3 ${depth > 0 ? 'ml-6 border-l-2 border-[#A890F0]/40 pl-4' : ''}`}>
            <div
                onClick={() => {
                    setSelectedTask(task);
                    if (onNavigate) onNavigate(task);
                }}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#A890F0] transition-colors cursor-pointer group"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {hasChildren && !hideChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                                className="p-1 -ml-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                title={isOpen ? "Згорнути підзавдання" : "Розгорнути підзавдання"}
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        <span className={`font-bold text-gray-900 group-hover:text-[#7E69AB] transition-colors ${!hasChildren || hideChildren ? 'ml-6' : ''}`}>
              {task.title}
            </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {task.category && (
                            <span className="text-gray-500 text-sm italic">
                {task.category}
              </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[task.status]}`}>
              {task.status}
            </span>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-1 gap-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {task.text}
                    </p>

                    {task.deadlineDays !== undefined && (
                        <span
                            className={`text-xs font-bold whitespace-nowrap ${
                                task.deadlineDays < 2 ? 'text-red-500' : 'text-gray-400'
                            }`}
                        >
              {task.deadlineDays} {task.deadlineDays === 1 ? 'day' : 'days'}
            </span>
                    )}
                </div>
            </div>

            {hasChildren && isOpen && !hideChildren && (
                <div className="children-container">
                    {task.children?.map((childTask) => (
                        <TaskItem
                            key={childTask.id}
                            task={childTask}
                            depth={depth + 1}
                            hideChildren={hideChildren}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
