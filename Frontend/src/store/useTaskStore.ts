import { create } from 'zustand';
import type { TaskNode } from '../components/tasks/NestedTaskItem';

interface TaskStore {
    selectedTask: TaskNode | null;
    setSelectedTask: (task: TaskNode | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    selectedTask: null, // За замовчуванням жодне завдання не вибрано
    setSelectedTask: (task) => set({ selectedTask: task }),
}));
