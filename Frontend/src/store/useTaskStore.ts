import { create } from 'zustand';
import type { TaskNode } from '../components/tasks/TaskItem.tsx';

interface TaskStore {
    selectedTask: TaskNode | null;
    setSelectedTask: (task: TaskNode | null) => void;
    // Стейт для модалки
    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),

    isCreateModalOpen: false,
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
