import NoteCard from '../components/notes/NoteCard';
import NoteDetails from '../components/notes/NoteDetails';
import { useNoteStore } from '../store/useNoteStore';

// Типізація для нотатки
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

    const selectedNote = useNoteStore((state) => state.selectedNote);
    const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
    const isEditingNote = useNoteStore((state) => state.isEditingNote);

    return (
        <div className="flex gap-8 h-full">

            {/* ЛІВА ЧАСТИНА: Список/Сітка нотаток (з таким же скролом, як у Tasks) */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">

                {/* Шапка сторінки */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Notes</h1>
                    <button className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                        <span className="text-xl leading-none">+</span> Add note
                    </button>
                </div>

                {/* Сітка нотаток (CSS Grid) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pb-10">
                    {initialNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            id={note.id}
                            text={note.text}
                            author={note.author}
                            tags={note.tags}
                            isSelected={selectedNote?.id === note.id}
                            onClick={() => setSelectedNote(note)}
                        />
                    ))}
                </div>
            </div>

            {/* ПРАВА ЧАСТИНА: Панель деталей (повністю уніфікована з Tasks) */}
            <div className={`bg-[#F3F4F6] rounded-2xl p-6 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isEditingNote ? 'w-[800px]' : 'w-96'}`}>

                {/* Уніфікований заголовок правої панелі */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditingNote ? 'Edit Note' : 'Note Details'}
                    </h2>
                </div>

                {/* Біла картка деталей */}
                <NoteDetails note={selectedNote} />
            </div>

        </div>
    );
}
