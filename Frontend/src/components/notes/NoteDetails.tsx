import { useNoteStore } from '../../store/useNoteStore';
import Button from '../ui/Button';
import EditButton from '../ui/EditButton';
import TextEditor from '../ui/TextEditor';

// Типізація для нотатки (можеш винести в окремий файл types.ts)
export interface NoteItem {
    id: number | string;
    text: string;
    author: string;
    tags: { label: string; color: string }[];
}

interface NoteDetailsProps {
    note: NoteItem | null;
}

export default function NoteDetails({ note }: NoteDetailsProps) {
    // Беремо стан редагування зі стору (аналогічно до тасок)
    const isEditingNote = useNoteStore((state) => state.isEditingNote);
    const setIsEditingNote = useNoteStore((state) => state.setIsEditingNote);

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
                {/* Інформаційний заголовок (бо в нотаток зазвичай немає окремого title) */}
                <div className="mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Редагування нотатки</span>
                </div>

                {/* Використовуємо наш новий ізольований компонент редактора */}
                <TextEditor defaultValue={note.text} />

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
                            alert('Тут ми будемо збирати JSON з редактора та зберігати нотатку на бекенді!');
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

            {/* Теги обраної нотатки */}
            <div className="flex gap-1.5 flex-wrap mb-4">
                {note.tags?.map((tag, index) => (
                    <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                        {tag.label}
                    </span>
                ))}
            </div>

            {/* Повний текст нотатки */}
            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Опис</span>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {note.text}
                </p>
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

                {/* Кнопка Delete (залишив той приємний червоний колір) */}
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
