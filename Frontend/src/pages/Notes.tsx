import { useState } from 'react';
import NoteCard from '../components/notes/NoteCard';

// Типізація для нотатки, щоб TypeScript не сварився
interface NoteItem {
    id: number;
    text: string;
    author: string;
    tags: { label: string; color: string }[];
}

export default function Notes() {
    const initialNotes: NoteItem[] = [
        {
            id: 1,
            text: "Перша тестова нотатка. Відображається прямокутним блоком. Текст буде обрізатися, якщо його занадто багато, а футер приб'ється до низу.",
            author: "Author 1",
            tags: [
                { label: '#frontend', color: 'bg-purple-200 text-purple-800' },
                { label: '#react', color: 'bg-blue-200 text-blue-800' }
            ]
        },
        {
            id: 2,
            text: "Коротка нотатка без великої кількості тексту.",
            author: "Author 2",
            tags: [
                { label: '#design', color: 'bg-yellow-200 text-yellow-800' }
            ]
        },
        {
            id: 3,
            text: "note text note text note text note text note text note text note text note text note text note text note text note text note text...",
            author: "Author 3",
            tags: []
        },
        {
            id: 4,
            text: "Ще одна нотатка для перевірки того, як сітка переносить елементи на новий рядок. Усе має виглядати чітко і рівно.",
            author: "Author 1",
            tags: [
                { label: '#urgent', color: 'bg-red-200 text-red-800' },
                { label: '#backend', color: 'bg-green-200 text-green-800' }
            ]
        }
    ];

    // Стан для обраної нотатки (за замовчуванням null)
    const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

    return (
        <div className="flex gap-8 h-full">

            {/* ЛІВА ЧАСТИНА: Список/Сітка нотаток (займає весь вільний простір) */}
            <div className="flex-1 flex flex-col">
                {/* Шапка сторінки */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notes</h1>
                    <button className="py-2.5 px-6 bg-[#A890F0] hover:bg-[#967deb] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none">+</span> Add note
                    </button>
                </div>

                {/* Сітка нотаток (CSS Grid) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {initialNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            id={note.id}
                            text={note.text}
                            author={note.author}
                            tags={note.tags}
                            isSelected={selectedNote?.id === note.id} // Перевіряємо, чи ця картка обрана
                            onClick={() => setSelectedNote(note)}     // Встановлюємо цю картку як обрану
                        />
                    ))}
                </div>
            </div>

            {/* ПРАВА ЧАСТИНА: Панель деталей (фіксована ширина, на всю висоту) */}
            <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col h-full pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Note Details</h2>

                {/* Біла картка деталей (flex-1 змушує її тягнутися до низу) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col flex-1">
                    {selectedNote ? (
                        <>
                            {/* Теги обраної нотатки */}
                            <div className="flex gap-1.5 flex-wrap mb-4">
                                {selectedNote.tags?.map((tag, index) => (
                                    <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                                        {tag.label}
                                    </span>
                                ))}
                            </div>

                            {/* Повний текст нотатки */}
                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Опис</span>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {selectedNote.text}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Автор</span>
                                <span className="text-sm font-semibold text-gray-800">{selectedNote.author}</span>
                            </div>

                            {/* Кнопки дій (mt-auto притискає їх до самого низу цієї великої картки) */}
                            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors">
                                    Edit
                                </button>
                                <button className="flex-1 py-2.5 bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold text-sm rounded-xl transition-colors">
                                    Delete
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <p className="text-gray-400 font-medium text-sm">
                                Натисніть на нотатку, щоб побачити деталі
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
