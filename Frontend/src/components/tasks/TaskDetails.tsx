import { useTaskStore } from '../../store/useTaskStore';
import type { TaskNode } from './TaskItem';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';
import TextEditor from '../ui/TextEditor';

interface TaskDetailsProps {
    task: TaskNode | null;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
    const isEditingTask = useTaskStore((state) => state.isEditingTask);
    const setIsEditingTask = useTaskStore((state) => state.setIsEditingTask);

    if (!task) {
        return (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                Оберіть завдання для перегляду
            </div>
        );
    }

    // РЕЖИМ РЕДАГУВАННЯ
    if (isEditingTask) {
        return (
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden overflow-y-auto custom-scrollbar">
                {/* Заголовок */}
                <div className="mb-4">
                    <input
                        type="text"
                        defaultValue={task.title}
                        className="w-full text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                        placeholder="Назва завдання..."
                    />
                </div>

                {/* Метадані (Категорія, Дедлайн, Батьківський елемент) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Категорія</label>
                        <select
                            defaultValue={task.category || ''}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2.5 outline-none cursor-pointer"
                        >
                            <option value="">Без категорії</option>
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Management">Management</option>
                            <option value="API">API</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Дедлайн (днів)</label>
                        <input
                            type="number"
                            defaultValue={task.deadlineDays}
                            placeholder="0"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2.5 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Батьківське завдання</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2.5 outline-none cursor-pointer"
                        >
                            {/* Поки що заглушка, пізніше тут буде масив всіх тасок з бекенду */}
                            <option value="">Без батьківського (кореневе завдання)</option>
                            <option value="1">Розробити фронтенд</option>
                            <option value="2">Інтеграція з бекендом</option>
                        </select>
                    </div>
                </div>

                {/* Використовуємо наш новий ізольований компонент редактора */}
                <TextEditor defaultValue={task.text} />

                {/* Кнопки збереження */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditingTask(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            alert('Тут ми будемо збирати всі нові поля і зберігати на бекенді!');
                            setIsEditingTask(false);
                        }}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        );
    }

    // ЗВИЧАЙНИЙ РЕЖИМ ПЕРЕГЛЯДУ
    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-y-auto custom-scrollbar">
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold inline-block">
                    {task.status}
                </span>
            </div>

            {/* Блок з Метаданими (Тільки для читання) */}
            <div className="flex flex-wrap gap-4 mb-6 border-y border-gray-100 py-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Категорія</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 inline-block">
                        {task.category || 'Немає'}
                    </span>
                </div>

                <div className="w-px bg-gray-200"></div>

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Дедлайн</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded-md border ${
                        task.deadlineDays !== undefined && task.deadlineDays <= 1
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-gray-50 text-gray-800 border-gray-100'
                    } inline-block`}>
                        {task.deadlineDays !== undefined ? `${task.deadlineDays} days` : 'Немає'}
                    </span>
                </div>

                <div className="w-px bg-gray-200"></div>

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Батьківське</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 inline-block">
                        {/* Пізніше тут буде пошук по id серед тасок, щоб вивести ім'я */}
                        Без батьківського
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Опис</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {task.text}
                </p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                <EditButton
                    className="flex-1"
                    onClick={() => setIsEditingTask(true)}
                />

                <Button
                    variant="primary"
                    className="flex-1"
                >
                    Complete
                </Button>
            </div>
        </div>
    );
}
