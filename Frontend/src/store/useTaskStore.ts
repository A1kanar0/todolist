import { create } from 'zustand';
import type { TaskNode } from '../components/tasks/TaskItem';

interface TaskStore {
    selectedTask: TaskNode | null;
    setSelectedTask: (task: TaskNode | null) => void;

    isCreateModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;

    // Додаємо стан для редагування
    isEditingTask: boolean;
    setIsEditingTask: (isEditing: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    selectedTask: null,
    // Скидаємо режим редагування при виборі іншої таски
    setSelectedTask: (task) => set({ selectedTask: task, isEditingTask: false }),

    isCreateModalOpen: false,
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    isEditingTask: false,
    setIsEditingTask: (isEditing) => set({ isEditingTask: isEditing }),
}));
