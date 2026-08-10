import { create } from 'zustand';
import type { TaskNode } from '../components/tasks/TaskItem';

interface TaskStore {
    selectedTask: TaskNode | null;
    setSelectedTask: (task: TaskNode | null) => void;

    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;

    isEditingTask: boolean;
    setIsEditingTask: (isEditing: boolean) => void;

    isSettingsModalOpen: boolean;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;

    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task, isEditingTask: false }),

    isCreateModalOpen: false,
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    isEditingTask: false,
    setIsEditingTask: (isEditing) => set({ isEditingTask: isEditing }),

    isSettingsModalOpen: false,
    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),

    theme: 'light',
    setTheme: (theme) => set({ theme }),
}));
