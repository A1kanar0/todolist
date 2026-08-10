import { useTaskStore } from '../../store/useTaskStore';
import type { TaskNode } from './TaskItem';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';

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
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden">
                {/* Заголовок */}
                <div className="mb-4">
                    <input
                        type="text"
                        defaultValue={task.title}
                        className="w-full text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                        placeholder="Назва завдання..."
                    />
                </div>

                {/* Заглушка під майбутній Rich Text Editor (який буде повертати JSON) */}
                <div className="flex-1 flex flex-col mb-4 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#A890F0] transition-all">

                    {/* Панель інструментів (заглушка) */}
                    <div className="flex gap-3 p-3 bg-gray-100 border-b border-gray-200 text-gray-600">
                        <button className="font-bold hover:text-[#A890F0]">B</button>
                        <button className="italic hover:text-[#A890F0]">I</button>
                        <button className="underline hover:text-[#A890F0]">U</button>
                        <div className="w-px bg-gray-300 mx-1"></div>
                        <button className="hover:text-[#A890F0]">🔗</button>
                        <button className="hover:text-[#A890F0]">📷</button>
                        <span className="ml-auto text-xs text-gray-400 font-medium self-center">JSON Editor Placeholder</span>
                    </div>

                    <textarea
                        defaultValue={task.text}
                        className="flex-1 w-full p-4 bg-gray-50 outline-none resize-none custom-scrollbar"
                        placeholder="Введіть детальний опис..."
                    ></textarea>
                </div>

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
                            alert('Тут ми будемо збирати JSON з редактора та зберігати його на бекенді!');
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

            <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Опис</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {task.text}
                </p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                {/* Використовуємо універсальну кнопку і передаємо їй потрібну дію */}
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
