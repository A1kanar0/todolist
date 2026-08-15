import { useEffect, useState, useMemo } from 'react';
import NoteCard from '../components/notes/NoteCard';
import NoteDetails from '../components/notes/NoteDetails';
import SearchInput from '../components/ui/SearchInput';
import { useNoteStore } from '../store/useNoteStore';

export default function Notes() {
    const notes = useNoteStore((state) => state.notes);
    const isLoading = useNoteStore((state) => state.isLoading);
    const fetchNotes = useNoteStore((state) => state.fetchNotes);

    // Достаємо теги зі стору для фільтра
    const tags = useNoteStore((state) => state.tags);
    const fetchTags = useNoteStore((state) => state.fetchTags);

    const selectedNote = useNoteStore((state) => state.selectedNote);
    const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
    const isEditingNote = useNoteStore((state) => state.isEditingNote);
    const openCreateModal = useNoteStore((state) => state.openCreateModal);

    // Стейт фільтрів
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const [filterTags, setFilterTags] = useState<number[]>([]);

    // Стейт для відкриття/закриття випадаючого списку тегів
    const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);

    // Завантажуємо нотатки та доступні теги
    useEffect(() => {
        fetchNotes();
        fetchTags();
    }, [fetchNotes, fetchTags]);

    // Витягуємо унікальних авторів з існуючих нотаток
    const uniqueAuthors = useMemo(() => {
        const authors = new Set(notes.map(n => n.author));
        return Array.from(authors).filter(Boolean);
    }, [notes]);

    // Логіка фільтрації нотаток
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = !searchQuery.trim() || note.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAuthor = !filterAuthor || note.author === filterAuthor;

            // Якщо обрано декілька тегів, нотатка має містити ЇХ УСІ (логіка AND).
            // Якщо потрібна логіка OR, замініть .every на .some
            const matchesTags = filterTags.length === 0 || filterTags.every(tagId =>
                note.tags?.some(t => Number(t.id) === tagId)
            );

            return matchesSearch && matchesAuthor && matchesTags;
        });
    }, [notes, searchQuery, filterAuthor, filterTags]);

    // Додавання / видалення тегу з фільтра
    const toggleTagFilter = (tagId: number) => {
        setFilterTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">

                {/* Шапка з фільтрами */}
                <div className="flex justify-between items-center mb-6 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight shrink-0">Notes</h1>

                    {/* Блок фільтрів по центру */}
                    <div className="flex flex-1 justify-center gap-2">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search notes..."
                            className="w-48"
                        />

                        {/* Фільтр по автору */}
                        <select
                            value={filterAuthor}
                            onChange={(e) => setFilterAuthor(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A890F0] shadow-sm cursor-pointer"
                        >
                            <option value="">All Authors</option>
                            {uniqueAuthors.map((author, idx) => (
                                <option key={idx} value={author}>{author}</option>
                            ))}
                        </select>

                        {/* Кастомний мультиселект для тегів */}
                        <div className="relative">
                            <button
                                onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
                                className={`px-4 py-2 bg-white border rounded-xl text-sm outline-none shadow-sm flex items-center gap-2 transition-colors ${
                                    isTagFilterOpen || filterTags.length > 0 ? 'border-[#A890F0]' : 'border-gray-200 hover:border-[#A890F0]'
                                }`}
                            >
                                Filter by Tags
                                {filterTags.length > 0 && (
                                    <span className="bg-[#A890F0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                        {filterTags.length}
                                    </span>
                                )}
                            </button>

                            {/* Випадаючий список тегів */}
                            {isTagFilterOpen && (
                                <>
                                    {/* Невидимий оверлей для закриття по кліку поза межами */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsTagFilterOpen(false)}
                                    ></div>

                                    <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl p-2 z-20 max-h-64 overflow-y-auto custom-scrollbar">
                                        {tags.length === 0 ? (
                                            <div className="text-xs text-gray-400 p-2 text-center">Немає доступних тегів</div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                {tags.map(tag => (
                                                    <label
                                                        key={tag.id}
                                                        className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filterTags.includes(tag.id)}
                                                            onChange={() => toggleTagFilter(tag.id)}
                                                            className="w-4 h-4 text-[#A890F0] rounded border-gray-300 focus:ring-[#A890F0] cursor-pointer"
                                                        />
                                                        <div className={`w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`}></div>
                                                        <span className="text-sm font-semibold text-gray-700 select-none flex-1 truncate">
                                                            {tag.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {filterTags.length > 0 && (
                                            <button
                                                onClick={() => setFilterTags([])}
                                                className="w-full mt-2 pt-2 border-t border-gray-100 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                            >
                                                Скинути вибір
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0"
                    >
                        <span className="text-xl leading-none">+</span> Add note
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <span className="text-gray-500 font-medium">Завантаження нотаток...</span>
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pb-10">
                        {filteredNotes.map((note) => (
                            <NoteCard
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                text={note.text}
                                author={note.author}
                                tags={note.tags}
                                variant="grid"
                                isSelected={selectedNote?.id === note.id}
                                onClick={() => setSelectedNote(note)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                        <span className="text-gray-400 font-medium">No notes found matching your filters</span>
                    </div>
                )}
            </div>

            <div className={`bg-[#F3F4F6] rounded-2xl p-6 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isEditingNote ? 'w-[800px]' : 'w-96'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditingNote ? 'Edit Note' : 'Note Details'}
                    </h2>
                </div>
                <NoteDetails note={selectedNote} />
            </div>
        </div>
    );
}
