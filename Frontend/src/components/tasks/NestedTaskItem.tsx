import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';

// Описуємо тип нашої таски з нескінченною вкладеністю
export interface TaskNode {
    id: string;
    title: string;
    text: string;
    status: 'todo' | 'in-progress' | 'done';
    children?: TaskNode[];
}

interface NestedTaskItemProps {
    task: TaskNode;
    depth?: number; // Рівень вкладеності (за замовчуванням 0)
}

export default function NestedTaskItem({ task, depth = 0 }: NestedTaskItemProps) {
    // Стейт для відстеження, чи розгорнута гілка (за замовчуванням так)
    const [isOpen, setIsOpen] = useState(true);

    // Перевіряємо, чи є у цієї таски діти
    const hasChildren = task.children && task.children.length > 0;

    // Отримуємо функцію для зміни обраної таски в глобальному сторі
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);

    // Визначаємо колір статусу
    const statusColors = {
        'todo': 'bg-gray-200 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'done': 'bg-green-100 text-green-700',
    };

    return (
        <div className={`mt-3 ${depth > 0 ? 'ml-6 border-l-2 border-[#A890F0]/40 pl-4' : ''}`}>
            {/* Сама картка таски */}
            <div
                onClick={() => setSelectedTask(task)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#A890F0] transition-colors cursor-pointer group"
            >
                <div className="flex justify-between items-start mb-2">

                    {/* Блок із заголовком та кнопкою згортання */}
                    <div className="flex items-center gap-2">
                        {hasChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Зупиняємо клік, щоб він не викликав вибір таски для правої панелі
                                    setIsOpen(!isOpen);
                                }}
                                className="p-1 -ml-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                title={isOpen ? "Згорнути підзавдання" : "Розгорнути підзавдання"}
                            >
                                {/* SVG іконка шеврона, яка крутиться залежно від стану isOpen */}
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        <span className={`font-bold text-gray-900 group-hover:text-[#7E69AB] transition-colors ${!hasChildren ? 'ml-6' : ''}`}>
              {task.title}
            </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[task.status]}`}>
            {task.status}
          </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {task.text}
                </p>
            </div>

            {/* Рекурсивний рендер дочірніх тасок, тільки якщо є діти і гілка відкрита (isOpen) */}
            {/* Додано опціональний ланцюжок (?.) для вирішення помилки TypeScript */}
            {hasChildren && isOpen && (
                <div className="children-container">
                    {task.children?.map((childTask) => (
                        <NestedTaskItem key={childTask.id} task={childTask} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
