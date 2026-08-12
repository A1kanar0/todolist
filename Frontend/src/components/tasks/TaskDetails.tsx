import { useState, useEffect } from 'react';
import { useTaskStore, type TaskNode } from '../../store/useTaskStore';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';
import TextEditor from '../ui/TextEditor';

interface TaskDetailsProps {
    task: TaskNode | null;
}

const formatForDateTimeInput = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
};

// Плоский список для select (виключаючи поточну таску)
const getFlatTaskList = (nodes: TaskNode[], excludeId?: string): { id: string; title: string }[] => {
    let result: { id: string; title: string }[] = [];
    nodes.forEach(node => {
        if (node.id !== excludeId) {
            result.push({ id: node.id, title: node.title });
            if (node.children) result = result.concat(getFlatTaskList(node.children, excludeId));
        }
    });
    return result;
};

// Пошук імені батька
const getParentTitle = (nodes: TaskNode[], parentId?: string | null): string => {
    if (!parentId) return 'Без батьківського';
    const all = getFlatTaskList(nodes);
    const found = all.find(t => t.id === parentId);
    return found ? found.title : 'Невідомо';
};

export default function TaskDetails({ task }: TaskDetailsProps) {
    const isEditingTask = useTaskStore((state) => state.isEditingTask);
    const setIsEditingTask = useTaskStore((state) => state.setIsEditingTask);
    const updateTask = useTaskStore((state) => state.updateTask);
    const tasksTree = useTaskStore((state) => state.tasks);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [deadline, setDeadline] = useState('');
    const [parentId, setParentId] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setCategory(task.category || '');
            setDeadline(formatForDateTimeInput(task.deadline));
            setParentId(task.parentId || '');
            setContent(task.text || '');
        }
    }, [task]);

    if (!task) {
        return (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                Оберіть завдання для перегляду
            </div>
        );
    }

    const handleSave = async () => {
        const input = {
            id: Number(task.id),
            title,
            content,
            isCompleted: task.status === 'done',
            deadline: deadline ? new Date(deadline).toISOString() : null,
            parentId: parentId ? Number(parentId) : null,
            // categoryId можна додати пізніше
        };
        await updateTask(input);
    };

    const availableParents = getFlatTaskList(tasksTree, task.id);

    if (isEditingTask) {
        return (
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden overflow-y-auto custom-scrollbar">
                <div className="mb-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                        placeholder="Назва завдання..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Категорія</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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
                        <label className="block text-sm font-bold text-gray-700 mb-1">Дедлайн</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2.5 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Батьківське завдання</label>
                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#A890F0] focus:border-[#A890F0] block p-2.5 outline-none cursor-pointer"
                        >
                            <option value="">Без батьківського (кореневе завдання)</option>
                            {availableParents.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Щоб TextEditor віддавав дані, йому бажано передати onChange,
                    але якщо він поки його не приймає, просто лишаємо як є. */}
                <TextEditor
                    defaultValue={content}
                    onChange={(val: string) => setContent(val)}
                />

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setIsEditingTask(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-y-auto custom-scrollbar">
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold inline-block">
                    {task.status}
                </span>
            </div>

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
                        task.deadline ? 'bg-gray-50 text-gray-800 border-gray-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                    } inline-block`}>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('uk-UA') : 'Немає'}
                    </span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Батьківське</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 inline-block">
                        {getParentTitle(tasksTree, task.parentId)}
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
                <EditButton className="flex-1" onClick={() => setIsEditingTask(true)} />
                <Button variant="primary" className="flex-1">
                    Complete
                </Button>
            </div>
        </div>
    );
}
