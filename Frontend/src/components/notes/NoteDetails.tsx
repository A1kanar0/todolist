import { useState, useEffect } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';
import TextEditor from '../ui/TextEditor';

// Додали ID в тип тегу, щоб відстежувати вибрані
export interface NoteItem {
    id: number | string;
    title: string;
    text: string;
    author: string;
    tags: { id: number; name: string; color: string }[];
}

interface NoteDetailsProps {
    note: NoteItem | null;
}

const TAG_COLORS = [
    { label: 'Сірий', value: 'bg-gray-100 text-gray-700' },
    { label: 'Червоний', value: 'bg-red-100 text-red-700' },
    { label: 'Зелений', value: 'bg-green-100 text-green-700' },
    { label: 'Синій', value: 'bg-blue-100 text-blue-700' },
    { label: 'Фіолетовий', value: 'bg-purple-100 text-purple-700' },
];

export default function NoteDetails({ note }: NoteDetailsProps) {
    const {
        isEditingNote,
        setIsEditingNote,
        deleteNote,
        isLoading,
        tags: globalTags,
        fetchTags,
        createTag,
        deleteTag,
        updateNote
    } = useNoteStore();

    // Локальний стейт
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // Стейт для створення нового тегу в режимі редагування
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    // Синхронізуємо стейт при виборі іншої нотатки або переході в режим редагування
    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.text || '');
            setSelectedTagIds(note.tags?.map(t => Number(t.id)) || []);
        }
    }, [note, isEditingNote]);

    // Завантажуємо всі можливі теги, коли переходимо в режим редагування
    useEffect(() => {
        if (isEditingNote) {
            fetchTags();
        }
    }, [isEditingNote, fetchTags]);

    if (!note) {
        return (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">
                Натисніть на нотатку, щоб побачити деталі
            </div>
        );
    }

    // Допоміжні функції для тегів у режимі редагування
    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        const existingTag = globalTags.find(t => t.name.toLowerCase() === newTagName.trim().toLowerCase());
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

    // ==========================================
    // РЕЖИМ РЕДАГУВАННЯ
    // ==========================================
    if (isEditingNote) {
        return (
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden overflow-y-auto custom-scrollbar">

                {/* Назва */}
                <div className="mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Редагування нотатки</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#A890F0] transition-all"
                        placeholder="Назва нотатки..."
                    />
                </div>

                {/* Блок редагування тегів */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-4 mb-4">
                    <div>
                        <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Оберіть теги</span>
                        <div className="flex flex-wrap gap-2">
                            {globalTags.length === 0 && <span className="text-sm text-gray-400">Немає доступних тегів</span>}
                            {globalTags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <div key={tag.id} className="relative group/tag flex items-center">
                                        <button
                                            onClick={() => toggleTag(tag.id)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border-2 pr-7 ${
                                                isSelected
                                                    ? `${tag.color} border-transparent shadow-sm scale-105`
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>

                                        {/* Кнопка глобального видалення */}
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`⚠️ Увага! Ви дійсно хочете НАЗАВЖДИ видалити тег "${tag.name}"? Він зникне з УСІХ нотаток у базі!`)) {
                                                    await deleteTag(Number(tag.id));
                                                    setSelectedTagIds(prev => prev.filter(id => id !== tag.id));
                                                }
                                            }}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-red-100/80 text-red-500 opacity-0 group-hover/tag:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                            title="Видалити тег назавжди"
                                        >
                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                        <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Або створіть новий</span>
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

                {/* Редактор контенту */}
                <div className="mt-2 flex-1 min-h-[200px] flex flex-col mb-4">
                    <TextEditor
                        value={content}
                        onChange={setContent}
                    />
                </div>

                {/* Кнопки збереження */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <Button variant="secondary" onClick={() => setIsEditingNote(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        disabled={isLoading}
                        onClick={async () => {
                            if (!title.trim() || !content.trim()) {
                                alert("Назва та текст не можуть бути порожніми.");
                                return;
                            }

                            const success = await updateNote(Number(note.id), title, content, selectedTagIds);

                            if (success) {
                                setIsEditingNote(false);
                            } else {
                                alert("Не вдалося зберегти зміни. Перевірте консоль.");
                            }
                        }}
                    >
                        {isLoading ? 'Збереження...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        );
    }

    // ==========================================
    // ЗВИЧАЙНИЙ РЕЖИМ ПЕРЕГЛЯДУ
    // ==========================================
    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl p-6 shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar">
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h3>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-4">
                {note.tags?.map((tag, index) => (
                    <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                        {tag.name}
                    </span>
                ))}
            </div>

            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Опис</span>
                {note.text && note.text.trim() ? (
                    <div
                        className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none [&_a]:text-[#A890F0] [&_a]:underline [&_a]:font-medium [&_a]:hover:text-[#967deb]"
                        dangerouslySetInnerHTML={{ __html: note.text }}
                    />
                ) : (
                    <p className="text-gray-400 italic text-sm">Опис відсутній</p>
                )}
            </div>

            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Автор</span>
                <span className="text-sm font-semibold text-gray-800">{note.author}</span>
            </div>

            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100 shrink-0">
                <EditButton className="flex-1" onClick={() => setIsEditingNote(true)} />
                <button
                    className="flex-1 py-2.5 bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
                    disabled={isLoading}
                    onClick={async () => {
                        if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
                            await deleteNote(Number(note.id));
                        }
                    }}
                >
                    {isLoading ? 'Видалення...' : 'Delete'}
                </button>
            </div>
        </div>
    );
}
