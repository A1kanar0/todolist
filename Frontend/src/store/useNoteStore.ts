import { create } from 'zustand';
// Зміни шлях імпорту на той, де лежить твій інтерфейс NoteItem
import type { NoteItem } from '../components/notes/NoteDetails';

interface NoteStore {
    selectedNote: NoteItem | null;
    setSelectedNote: (note: NoteItem | null) => void;

    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;

    isEditingNote: boolean;
    setIsEditingNote: (isEditing: boolean) => void;

    // Стан для налаштувань
    isSettingsModalOpen: boolean;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;

    // Стан для теми
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
    // Дефолтні значення та екшени для нотаток
    selectedNote: null,
    setSelectedNote: (note) => set({ selectedNote: note, isEditingNote: false }),

    isCreateModalOpen: false,
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    isEditingNote: false,
    setIsEditingNote: (isEditing) => set({ isEditingNote: isEditing }),

    // Екшени для налаштувань
    isSettingsModalOpen: false,
    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),

    // Тема
    theme: 'light',
    setTheme: (theme) => set({ theme }),
}));
