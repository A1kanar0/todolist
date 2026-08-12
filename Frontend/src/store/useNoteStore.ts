import { create } from 'zustand';
import type { NoteItem } from '../components/notes/NoteDetails';

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

// 1. ОНОВЛЕНИЙ ЗАПИТ (відповідає C# класу Note)
const GET_NOTES_QUERY = `
  query {
    notes {
      id
      title
      content
      authorId
      author {
        username
      }
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
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_NOTES_QUERY }),
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // 2. МАПІНГ ДАНИХ (Перетворюємо C# поля на ті, що чекає UI)
            const mappedNotes: NoteItem[] = result.data.notes.map((backendNote: any) => ({
                id: backendNote.id,
                title: backendNote.title,
                text: backendNote.content,
                author: backendNote.author?.username || 'Невідомий',
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
