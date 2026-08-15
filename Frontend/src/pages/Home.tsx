import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore, type TaskNode } from '../store/useTaskStore';
import { useNoteStore } from '../store/useNoteStore';
import TaskItem from '../components/tasks/TaskItem';
import NoteCard from '../components/notes/NoteCard';

// Хелпер для очищення тексту від HTML-тегів для прев'ю в картці
const stripHtml = (html?: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

export default function Home() {
    const navigate = useNavigate();

    // Стейт тасок
    const openCreateTaskModal = useTaskStore((state) => state.openCreateModal);
    const tasksTree = useTaskStore((state) => state.tasks);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const isTasksLoading = useTaskStore((state) => state.isLoading);

    // Стейт нотаток
    const notes = useNoteStore((state) => state.notes);
    const fetchNotes = useNoteStore((state) => state.fetchNotes);
    const isNotesLoading = useNoteStore((state) => state.isLoading);
    const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
    const openCreateNoteModal = useNoteStore((state) => state.openCreateModal);

    // Завантажуємо і таски, і нотатки при старті
    useEffect(() => {
        fetchTasks();
        fetchNotes();
    }, [fetchTasks, fetchNotes]);

    // Розгортаємо дерево в плоский список, відсіюємо виконані і сортуємо по дедлайнам
    const sortedTasks = useMemo(() => {
        const flattenTasks = (nodes: TaskNode[]): TaskNode[] => {
            let result: TaskNode[] = [];
            nodes.forEach(node => {
                result.push(node);
                if (node.children && node.children.length > 0) {
                    result = result.concat(flattenTasks(node.children));
                }
            });
            return result;
        };

        const flatTasks = flattenTasks(tasksTree);

        return flatTasks
            .filter(task => task.status !== 'done')
            .sort((a, b) => {
                const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return dateA - dateB;
            });
    }, [tasksTree]);

    // Обробник створення нової нотатки з головної
    const handleAddNote = () => {
        navigate('/notes');
        openCreateNoteModal();
    };

    return (
        <div className="flex gap-8 h-full">

            {/* Ліва частина: Таски */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Home</h1>

                    <button
                        onClick={openCreateTaskModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xl leading-none">+</span> Add task
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
                    {isTasksLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <span className="text-gray-500 font-medium">Завантаження завдань...</span>
                        </div>
                    ) : sortedTasks.length > 0 ? (
                        <div className="flex flex-col">
                            {sortedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    hideChildren={true}
                                    onNavigate={() => navigate('/tasks')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-200 rounded-xl">
                            <span className="text-gray-400 font-medium">No active tasks</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Права частина: Нотатки */}
            <div className="w-80 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notes</h2>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
                    {isNotesLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <span className="text-gray-400 text-sm">Завантаження...</span>
                        </div>
                    ) : notes.length > 0 ? (
                        notes.map(note => (
                            <NoteCard
                                key={note.id}
                                title={note.title}
                                text={note.text}
                                author={note.author}
                                tags={note.tags}
                                onClick={() => {
                                    setSelectedNote(note);
                                    navigate('/notes');
                                }}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-xl">
                            <span className="text-gray-400 text-sm font-medium">Нотаток ще немає</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddNote}
                    className="mt-6 w-full py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <span className="text-xl">+</span> Add note
                </button>
            </div>

        </div>
    );
}
