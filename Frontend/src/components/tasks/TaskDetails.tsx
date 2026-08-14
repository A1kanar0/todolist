import { useState } from 'react';
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
    if (isNaN(date.getTime())) return '';
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
};

const getFlatTaskList = (nodes: TaskNode[], excludeId?: string | number): { id: string; title: string }[] => {
    let result: { id: string; title: string }[] = [];
    nodes.forEach(node => {
        if (String(node.id) !== String(excludeId)) {
            result.push({ id: String(node.id), title: node.title });
            if (node.children) result = result.concat(getFlatTaskList(node.children, excludeId));
        }
    });
    return result;
};

export default function TaskDetails({ task }: TaskDetailsProps) {
    const isEditingTask = useTaskStore((state) => state.isEditingTask);
    const setIsEditingTask = useTaskStore((state) => state.setIsEditingTask);
    const updateTask = useTaskStore((state) => state.updateTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const tasksTree = useTaskStore((state) => state.tasks);
    const users = useTaskStore((state) => state.users);
    const categories = useTaskStore((state) => state.categories);
    const setSelectedTask = useTaskStore((state) => state.setSelectedTask);

    const [prevTaskId, setPrevTaskId] = useState(task?.id);

    const [title, setTitle] = useState(task?.title || '');
    const [categoryId, setCategoryId] = useState(task?.categoryId ? String(task.categoryId) : '');
    const [executorIds, setExecutorIds] = useState<string[]>(task?.executorIds ? task.executorIds.map(String) : []);
    const [deadline, setDeadline] = useState(formatForDateTimeInput(task?.deadline));
    const [parentId, setParentId] = useState(task?.parentId ? String(task.parentId) : '');
    const [content, setContent] = useState(task?.text || '');

    // Синхронізація форматування при зміні вибраної таски
    if (task && task.id !== prevTaskId) {
        setPrevTaskId(task.id);
        setTitle(task.title || '');
        setCategoryId(task.categoryId ? String(task.categoryId) : '');
        setExecutorIds(task.executorIds ? task.executorIds.map(String) : []);
        setDeadline(formatForDateTimeInput(task.deadline));
        setParentId(task.parentId ? String(task.parentId) : '');
        setContent(task.text || '');
    }

    if (!task) {
        return (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                Оберіть завдання для перегляду
            </div>
        );
    }

    const availableParents = getFlatTaskList(tasksTree, task.id);

    const getParentTitle = (pId?: string | number | null) => {
        if (!pId) return 'Без батьківського';
        return availableParents.find(t => String(t.id) === String(pId))?.title || 'Без батьківського';
    };

    const getCategoryName = (cId?: string | number | null) => {
        if (cId === undefined || cId === null || cId === '') return 'Немає';
        return categories.find(c => String(c.id) === String(cId))?.name || 'Немає';
    };

    const getExecutorNames = (uIds?: (string | number)[] | null) => {
        if (!uIds || uIds.length === 0) return 'Не призначено';
        const foundUsers = users.filter(u => uIds.map(String).includes(String(u.id)));
        return foundUsers.length > 0 ? foundUsers.map(u => u.username).join(', ') : 'Не призначено';
    };

    const toggleExecutor = (id: string) => {
        setExecutorIds(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        const updatedDeadline = deadline ? new Date(deadline).toISOString() : null;
        const numCategoryId = categoryId ? Number(categoryId) : null;
        const numParentId = parentId ? Number(parentId) : null;
        const executorNumIds = executorIds.map(Number);

        const input = {
            id: Number(task.id),
            title,
            content: content || ' ',
            isCompleted: task.status === 'done',
            categoryId: numCategoryId,
            parentId: numParentId,
            deadline: updatedDeadline,
            executorIds: executorNumIds,
        };

        await updateTask(input);

        setSelectedTask({
            ...task,
            title,
            text: content,
            categoryId: numCategoryId ? String(numCategoryId) : null,
            executorIds: executorIds,
            deadline: updatedDeadline || undefined,
            parentId: numParentId ? String(numParentId) : null,
        });

        setIsEditingTask(false);
    };

    const handleDelete = async () => {
        if (window.confirm(`Видалити завдання "${task.title}"?`)) {
            await deleteTask(Number(task.id));
        }
    };

    if (isEditingTask) {
        return (
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden overflow-y-auto custom-scrollbar">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg outline-none mb-4"
                    placeholder="Назва завдання..."
                />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Категорія</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 outline-none cursor-pointer"
                        >
                            <option value="">Без категорії</option>
                            {categories.map(c => (
                                <option key={c.id} value={String(c.id)}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Дедлайн</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Батьківське завдання</label>
                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 outline-none cursor-pointer"
                        >
                            <option value="">Без батьківського (кореневе)</option>
                            {availableParents.map(p => (
                                <option key={p.id} value={String(p.id)}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Виконавці</label>
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 max-h-28 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                            {users.length === 0 && <span className="text-sm text-gray-400 p-1">Немає користувачів</span>}
                            {users.map(u => (
                                <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={executorIds.includes(String(u.id))}
                                        onChange={() => toggleExecutor(String(u.id))}
                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-800 select-none">{u.username}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <TextEditor value={content} onChange={setContent} />

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl text-sm">Видалити</button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsEditingTask(false)}>Скасувати</Button>
                        <Button variant="primary" onClick={handleSave}>Зберегти</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold inline-block w-fit mb-4">{task.status}</span>
            <div className="flex flex-wrap gap-4 mb-6 border-y border-gray-100 py-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Категорія</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border">{getCategoryName(task.categoryId)}</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Виконавці</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border">{getExecutorNames(task.executorIds)}</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Дедлайн</span>
                    <span className="text-sm font-bold px-2 py-1 rounded-md border">{task.deadline ? new Date(task.deadline).toLocaleDateString('uk-UA') : 'Немає'}</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Батьківське</span>
                    <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border">{getParentTitle(task.parentId)}</span>
                </div>
            </div>
            <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Опис</h4>
                {task.text && task.text.trim() ? (
                    <div className="text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: task.text }} />
                ) : (
                    <p className="text-gray-400 italic">Опис відсутній</p>
                )}
            </div>
            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                <EditButton className="flex-1" onClick={() => setIsEditingTask(true)} />
                {/* ОНОВЛЕНА КНОПКА ВИКОНАННЯ */}
                <Button
                    variant="primary"
                    className={`flex-1 ${task.hasUncompletedChildren ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    disabled={task.hasUncompletedChildren}
                    onClick={() => {
                        if (!task.hasUncompletedChildren) {
                            alert('Логіка виконання (в розробці)');
                        }
                    }}
                    title={task.hasUncompletedChildren ? 'Спочатку виконайте всі підзавдання' : 'Виконати завдання'}
                >
                    Complete
                </Button>
            </div>
        </div>
    );
}
