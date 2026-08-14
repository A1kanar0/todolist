import { useState } from 'react';
import { useTaskStore, type TaskNode } from '../../store/useTaskStore';
import Button from '../ui/Button';
import TextEditor from '../ui/TextEditor';

const getFlatTaskList = (nodes: TaskNode[]): { id: string; title: string }[] => {
    let result: { id: string; title: string }[] = [];
    nodes.forEach(node => {
        result.push({ id: node.id, title: node.title });
        if (node.children) result = result.concat(getFlatTaskList(node.children));
    });
    return result;
};

export default function CreateTaskModal() {
    const isCreateModalOpen = useTaskStore((state) => state.isCreateModalOpen);
    const closeCreateModal = useTaskStore((state) => state.closeCreateModal);
    const createTask = useTaskStore((state) => state.createTask);
    const tasksTree = useTaskStore((state) => state.tasks);
    const users = useTaskStore((state) => state.users);
    const categories = useTaskStore((state) => state.categories);
    const isLoading = useTaskStore((state) => state.isLoading);

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [executorId, setExecutorId] = useState('');
    const [deadline, setDeadline] = useState('');
    const [parentId, setParentId] = useState('');
    const [content, setContent] = useState('');

    if (!isCreateModalOpen) return null;

    const availableParents = getFlatTaskList(tasksTree);

    const handleCreate = async () => {
        const input = {
            title: title.trim() || 'Нове завдання',
            content: content || ' ',
            categoryId: categoryId ? Number(categoryId) : null,
            parentId: parentId ? Number(parentId) : null,
            deadline: deadline ? new Date(deadline).toISOString() : null,
            executorIds: executorId ? [Number(executorId)] : null,
        };

        const isSuccess = await createTask(input);

        if (isSuccess) {
            setTitle('');
            setCategoryId('');
            setExecutorId('');
            setDeadline('');
            setParentId('');
            setContent('');
            closeCreateModal();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 shrink-0">Створити нове завдання</h2>

                <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Назва завдання..."
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold cursor-pointer"
                        >
                            <option value="">Оберіть категорію...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-500 font-semibold cursor-pointer"
                        />

                        <select
                            value={executorId}
                            onChange={(e) => setExecutorId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold cursor-pointer"
                        >
                            <option value="">Оберіть виконавця...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>

                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold cursor-pointer"
                        >
                            <option value="">Без батьківського (Кореневе)</option>
                            {availableParents.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-2 flex-1 min-h-[200px] flex flex-col">
                        <TextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Детальний опис..."
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-6 shrink-0">
                    <Button variant="secondary" className="flex-1" onClick={closeCreateModal}>Скасувати</Button>
                    <Button variant="primary" className="flex-1" onClick={handleCreate} disabled={isLoading}>
                        {isLoading ? 'Створення...' : 'Створити'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
