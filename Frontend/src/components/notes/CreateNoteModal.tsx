import { useState, useEffect } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import Button from '../ui/Button';

// Доступні кольори для нових тегів
const TAG_COLORS = [
    { label: 'Сірий', value: 'bg-gray-100 text-gray-700' },
    { label: 'Червоний', value: 'bg-red-100 text-red-700' },
    { label: 'Зелений', value: 'bg-green-100 text-green-700' },
    { label: 'Синій', value: 'bg-blue-100 text-blue-700' },
    { label: 'Фіолетовий', value: 'bg-purple-100 text-purple-700' },
];

export default function CreateNoteModal() {
    const {
        isCreateModalOpen,
        closeCreateModal,
        tags,
        fetchTags,
        createTag,
        createNote,
        isLoading
    } = useNoteStore();

    // Стан форми
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // Стан для створення нового тегу
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    // Завантажуємо теги щоразу, коли модалка відкривається
    useEffect(() => {
        if (isCreateModalOpen) {
            fetchTags();
        }
    }, [isCreateModalOpen, fetchTags]);

    // Закриття з очищенням форми
    const handleClose = () => {
        setTitle('');
        setContent('');
        setSelectedTagIds([]);
        setNewTagName('');
        closeCreateModal();
    };

    if (!isCreateModalOpen) return null;

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        // Перевіряємо, чи немає вже тегу з таким іменем на бекенді (локально)
        const existingTag = tags.find(t => t.name.toLowerCase() === newTagName.trim().toLowerCase());

        if (existingTag) {
            if (!selectedTagIds.includes(existingTag.id)) {
                setSelectedTagIds([...selectedTagIds, existingTag.id]);
            }
            setNewTagName('');
            return;
        }

        setIsCreatingTag(true);
        const newTag = await createTag(newTagName.trim(), newTagColor);
        setIsCreatingTag(false);

        if (newTag) {
            setSelectedTagIds([...selectedTagIds, newTag.id]);
            setNewTagName('');
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Будь ласка, заповніть назву та текст нотатки.");
            return;
        }

        const success = await createNote(title, content, selectedTagIds);

        if (success) {
            handleClose();
        } else {
            alert("Не вдалося створити нотатку. Перевірте консоль.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all flex flex-col gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-extrabold text-gray-800">Створити нову нотатку</h2>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Назва нотатки..."
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold transition-all"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Текст нотатки..."
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-700 min-h-[160px] resize-none custom-scrollbar transition-all"
                ></textarea>

                {/* Блок роботи з тегами */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div>
                        <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Оберіть теги
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {tags.length === 0 && <span className="text-sm text-gray-400">Немає доступних тегів</span>}
                            {tags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border-2 ${
                                            isSelected
                                                ? `${tag.color} border-transparent shadow-sm scale-105`
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                        <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Або створіть новий
                        </span>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Назва тегу..."
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] text-sm font-semibold"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                            />
                            <select
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] text-sm font-semibold cursor-pointer"
                            >
                                {TAG_COLORS.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleCreateTag}
                                disabled={!newTagName.trim() || isCreatingTag}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isCreatingTag ? 'Додаємо...' : 'Додати'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Кнопки дій */}
                <div className="flex gap-4 mt-2">
                    <Button variant="secondary" className="flex-1" onClick={handleClose}>
                        Скасувати
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Створення...' : 'Створити'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
