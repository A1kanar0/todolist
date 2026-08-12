import { create } from 'zustand';

// 1. Інтерфейс переїхав сюди, щоб не було циклічних залежностей!
export interface TaskNode {
    id: string;
    title: string;
    text: string;
    status: 'todo' | 'in-progress' | 'done';
    children?: TaskNode[];
    deadline?: string; // Змінили на рядок (datetime)
    category?: string;
    categoryId?: string;
    parentId?: string | null;
}

interface TaskStore {
    // Дані завдань
    tasks: TaskNode[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    updateTask: (input: any) => Promise<void>;

    // UI Стани
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

const GET_TASKS_QUERY = `
  query {
    tasks {
      id title content isCompleted deadline categoryId parentId
    }
  }
`;

const UPDATE_TASK_MUTATION = `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id parentId
    }
  }
`;

const buildTaskTree = (flatTasks: any[]): TaskNode[] => {
    if (!Array.isArray(flatTasks)) return [];

    const taskMap = new Map<string, TaskNode>();
    const tree: TaskNode[] = [];

    // Крок 1: Створюємо всі вузли
    flatTasks.forEach(task => {
        if (!task) return;
        const stringId = task.id.toString();
        taskMap.set(stringId, {
            id: stringId,
            title: task.title || 'Без назви',
            text: task.content || '',
            status: task.isCompleted ? 'done' : 'todo',
            categoryId: task.categoryId ? task.categoryId.toString() : undefined,
            parentId: task.parentId ? task.parentId.toString() : null,
            deadline: task.deadline ? task.deadline : undefined,
            children: []
        });
    });

    // Крок 2: Будуємо дерево
    flatTasks.forEach(task => {
        if (!task) return;
        const stringId = task.id.toString();
        const currentTask = taskMap.get(stringId)!;

        if (task.parentId) {
            const parentStringId = task.parentId.toString();
            const parentTask = taskMap.get(parentStringId);
            if (parentTask) {
                if (!parentTask.children) parentTask.children = [];
                parentTask.children.push(currentTask);
            } else {
                tree.push(currentTask);
            }
        } else {
            tree.push(currentTask);
        }
    });

    return tree;
};

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ query: GET_TASKS_QUERY }),
            });
            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            const tasksTree = buildTaskTree(result.data.tasks);
            set({ tasks: tasksTree, isLoading: false });
        } catch (error: any) {
            console.error('Помилка:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    updateTask: async (input) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: UPDATE_TASK_MUTATION,
                    variables: { input }
                }),
            });
            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            await useTaskStore.getState().fetchTasks();
            set({ isEditingTask: false });
        } catch (error: any) {
            console.error('Помилка оновлення:', error);
            set({ error: error.message, isLoading: false });
        }
    },

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
