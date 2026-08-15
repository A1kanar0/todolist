import { useEffect, useState, useMemo } from 'react';
import NoteCard from '../components/notes/NoteCard';
import NoteDetails from '../components/notes/NoteDetails';
import SearchInput from '../components/ui/SearchInput';
import { useNoteStore } from '../store/useNoteStore';

export default function Notes() {
    const notes = useNoteStore((state) => state.notes);
    const isLoading = useNoteStore((state) => state.isLoading);
    const fetchNotes = useNoteStore((state) => state.fetchNotes);
    const selectedNote = useNoteStore((state) => state.selectedNote);
    const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
    const isEditingNote = useNoteStore((state) => state.isEditingNote);
    const openCreateModal = useNoteStore((state) => state.openCreateModal);

    // Додали стейт пошуку
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Логіка фільтрації нотаток
    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return notes;
        return notes.filter(note =>
            note.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [notes, searchQuery]);

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight shrink-0">Notes</h1>

                    {/* Пошук нотаток по центру */}
                    <div className="flex flex-1 justify-center">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search notes..."
                            className="w-64"
                        />
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
                        <span className="text-gray-400 font-medium">No notes found</span>
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
