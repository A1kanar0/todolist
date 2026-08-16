import { create } from 'zustand';
import type { NoteItem } from '../components/notes/NoteDetails';
import { fetchGraphQL } from '../utils/api';
import { useAuthStore } from './useAuthStore';

export interface TagItem {
    id: number;
    name: string;
    color: string;
}

interface NoteStore {
    notes: NoteItem[];
    tags: TagItem[]; // Зберігаємо глобальні теги тут
    isLoading: boolean;
    error: string | null;
    selectedNote: NoteItem | null;
    isCreateModalOpen: boolean;
    isEditingNote: boolean;
    isSettingsModalOpen: boolean;
    theme: 'light' | 'dark' | 'system';

    fetchNotes: () => Promise<void>;
    fetchTags: () => Promise<void>;
    createTag: (name: string, color: string) => Promise<TagItem | null>;
    deleteTag: (id: number) => Promise<boolean>;
    createNote: (title: string, content: string, tagIds: number[]) => Promise<boolean>;
    deleteNote: (id: number) => Promise<boolean>;
    updateNote: (id: number, title: string, content: string, tagIds: number[]) => Promise<boolean>;

    setSelectedNote: (note: NoteItem | null) => void;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    setIsEditingNote: (isEditing: boolean) => void;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// ----------------- ЗАПИТИ -----------------
const GET_NOTES_QUERY = `
  query {
    notes {
      id title content authorId
      author { username }
      tags { id name color }
    }
  }
`;

const GET_TAGS_QUERY = `
  query {
    tags { id name color }
  }
`;

const CREATE_TAG_MUTATION = `
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) { id name color }
  }
`;

const CREATE_NOTE_MUTATION = `
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) { id }
  }
`;

const UPDATE_NOTE_MUTATION = `
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) { id }
  }
`;

const DELETE_NOTE_MUTATION = `
  mutation DeleteNote($id: Int!) {
    deleteNote(id: $id)
  }
`;

const DELETE_TAG_MUTATION = `
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id)
  }
`;
// ------------------------------------------

export const useNoteStore = create<NoteStore>((set, get) => ({
    notes: [],
    tags: [],
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
            const data = await fetchGraphQL(GET_NOTES_QUERY);
            const mappedNotes: NoteItem[] = data.notes.map((backendNote: any) => ({
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

    fetchTags: async () => {
        try {
            const data = await fetchGraphQL(GET_TAGS_QUERY);
            set({ tags: data.tags || [] });
        } catch (error) {
            console.error("Не вдалося завантажити теги:", error);
        }
    },

    createTag: async (name, color) => {
        try {
            const data = await fetchGraphQL(CREATE_TAG_MUTATION, { input: { name, color } });
            const newTag = data.createTag;
            // Додаємо новий тег у локальний стейт, щоб він відразу з'явився в модалці
            set((state) => ({ tags: [...state.tags, newTag] }));
            return newTag;
        } catch (error: any) {
            set({ error: error.message });
            return null;
        }
    },

    deleteTag: async (id: number) => {
        try {
            await fetchGraphQL(DELETE_TAG_MUTATION, { id });

            set((state) => ({ tags: state.tags.filter(t => t.id !== id) }));

            get().fetchNotes();
            return true;
        } catch (error: any) {
            console.error("Помилка видалення тегу:", error);
            return false;
        }
    },

    createNote: async (title, content, tagIds) => {
        set({ isLoading: true, error: null });
        try {
            // authorId ставимо 0, оскільки бекенд замінить його на ID з JWT токена
            await fetchGraphQL(CREATE_NOTE_MUTATION, {
                input: { authorId: 0, title, content, tagIds }
            });

            // Після успішного створення — оновлюємо список нотаток
            await get().fetchNotes();
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    updateNote: async (id, title, content, tagIds) => {
        set({ isLoading: true, error: null });
        try {
            const currentUser = useAuthStore.getState().user;
            const authorId = currentUser ? Number(currentUser.id) : 0;

            await fetchGraphQL(UPDATE_NOTE_MUTATION, {
                input: { id, authorId, title, content, tagIds }
            });

            // 1. Оновлюємо загальний список нотаток
            await get().fetchNotes();

            // 2. ДОДАНО: Шукаємо свіжу версію цієї нотатки у щойно завантаженому списку
            const updatedNote = get().notes.find(n => Number(n.id) === id);

            // 3. Оновлюємо selectedNote, щоб UI миттєво відмалював нові дані
            set({
                selectedNote: updatedNote || null,
                isLoading: false
            });

            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    deleteNote: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await fetchGraphQL(DELETE_NOTE_MUTATION, { id });

            // Оновлюємо список нотаток і закриваємо деталі/редагування
            await get().fetchNotes();
            set({ selectedNote: null, isEditingNote: false, isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
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
