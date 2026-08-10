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

    // ДОДАЄМО СТАН ДЛЯ НАЛАШТУВАНЬ
    isSettingsModalOpen: boolean;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;

    // Додаємо тип та стан для теми
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

    // ДОДАЄМО ЕКШЕНИ ДЛЯ НАЛАШТУВАНЬ
    isSettingsModalOpen: false,
    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),

    theme: 'light', // за замовчуванням світла
    setTheme: (theme) => set({ theme }),
}));
