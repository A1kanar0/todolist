import { create } from 'zustand';
import type { NoteItem } from '../components/notes/NoteDetails';
import { fetchGraphQL } from '../utils/api';

interface NoteStore {
    notes: NoteItem[];
    isLoading: boolean;
    error: string | null;
    selectedNote: NoteItem | null;
    isCreateModalOpen: boolean;
    isEditingNote: boolean;
    isSettingsModalOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    fetchNotes: () => Promise<void>;
    setSelectedNote: (note: NoteItem | null) => void;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    setIsEditingNote: (isEditing: boolean) => void;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// ЗАПИТ
const GET_NOTES_QUERY = `
  query {
    notes {
      id
      title
      content
      authorId
      tags {
        name
        color
      }
    }
  }
`;

export const useNoteStore = create<NoteStore>((set) => ({
    notes: [],
    isLoading: false,
    error: null,
    selectedNote: null,
    isCreateModalOpen: false,
    isEditingNote: false,
    isSettingsModalOpen: false,
    theme: 'light',

    fetchNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            // 1. Використовуємо функцію-обгортку (токен додасться автоматично)
            const data = await fetchGraphQL(GET_NOTES_QUERY);

            // 2. МАПІНГ ДАНИХ (Перетворюємо C# поля на ті, що чекає UI)
            const mappedNotes: NoteItem[] = data.notes.map((backendNote: any) => ({
                id: backendNote.id,
                title: backendNote.title,
                text: backendNote.content,
                author: `Author ID: ${backendNote.authorId}`,
                tags: backendNote.tags || []
            }));

            set({ notes: mappedNotes, isLoading: false });
        } catch (error: any) {
            console.error(error);
            set({ error: error.message, isLoading: false });
        }
    },

    setSelectedNote: (note) => set({ selectedNote: note, isEditingNote: false }),
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    setIsEditingNote: (isEditing) => set({ isEditingNote: isEditing }),
    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),
    setTheme: (theme) => set({ theme }),
}));
