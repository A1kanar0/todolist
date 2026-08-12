import { useState } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';
import TextEditor from '../ui/TextEditor';

export interface NoteItem {
    id: number | string;
    title: string;
    text: string;
    author: string;
    tags: { name: string; color: string }[];
}

interface NoteDetailsProps {
    note: NoteItem | null;
}

export default function NoteDetails({ note }: NoteDetailsProps) {
    const isEditingNote = useNoteStore((state) => state.isEditingNote);
    const setIsEditingNote = useNoteStore((state) => state.setIsEditingNote);

    // Стейт для редагування
    const [prevNoteId, setPrevNoteId] = useState(note?.id);
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.text || '');

    // Синхронізація стейту під час зміни обраної нотатки
    if (note && note.id !== prevNoteId) {
        setPrevNoteId(note.id);
        setTitle(note.title || '');
        setContent(note.text || '');
    }

    if (!note) {
        return (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">
                Натисніть на нотатку, щоб побачити деталі
            </div>
        );
    }

    // ==========================================
    // РЕЖИМ РЕДАГУВАННЯ
    // ==========================================
    if (isEditingNote) {
        return (
            <div className="flex-1 flex flex-col bg-white rounded-xl p-5 border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                {/* Заголовок та інпут назви */}
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

                {/* Редактор тексту з правильними пропсами */}
                <TextEditor value={content} onChange={setContent} />

                {/* Кнопки збереження */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditingNote(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            // Тут надалі буде виклик оновлення в сторі: updateNote({ id: note.id, title, text: content })
                            alert(`Зберігаємо:\nЗаголовок: ${title}\nТекст: ${content}`);
                            setIsEditingNote(false);
                        }}
                    >
                        Save Changes
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
            {/* Назва нотатки */}
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h3>
            </div>

            {/* Теги обраної нотатки */}
            <div className="flex gap-1.5 flex-wrap mb-4">
                {note.tags?.map((tag, index) => (
                    <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                        {tag.name}
                    </span>
                ))}
            </div>

            {/* Повний текст нотатки (підтримка HTML від TextEditor) */}
            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Опис</span>
                {note.text && note.text.trim() ? (
                    <div
                        className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.text }}
                    />
                ) : (
                    <p className="text-gray-400 italic text-sm">Опис відсутній</p>
                )}
            </div>

            {/* Автор */}
            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Автор</span>
                <span className="text-sm font-semibold text-gray-800">{note.author}</span>
            </div>

            {/* Кнопки дій */}
            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
                <EditButton
                    className="flex-1"
                    onClick={() => setIsEditingNote(true)}
                />

                <button
                    className="flex-1 py-2.5 bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold text-sm rounded-xl transition-colors"
                    onClick={() => alert('Тут буде логіка видалення')}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
