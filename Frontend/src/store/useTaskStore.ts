import { create } from 'zustand';

export interface UserNode {
    id: string;
    username: string;
    email: string;
}

export interface CategoryNode {
    id: string;
    name: string;
}

export interface TaskNode {
    id: string;
    title: string;
    text: string;
    status: 'todo' | 'in-progress' | 'done';
    children?: TaskNode[];
    deadline?: string;
    categoryId?: string | null;
    executorIds?: string[];
    parentId?: string | null;
    hasUncompletedChildren?: boolean;
}

export interface CreateTaskInput {
    title: string;
    content: string;
    deadline?: string | null;
    categoryId?: number | null;
    parentId?: number | null;
    executorIds?: number[] | null;
}

export interface UpdateTaskInput {
    id: number;
    title: string;
    content: string;
    isCompleted: boolean;
    deadline?: string | null;
    categoryId?: number | null;
    parentId?: number | null;
    executorIds?: number[] | null;
}

interface FlatTask {
    id: string | number;
    title: string;
    content?: string;
    isCompleted: boolean;
    categoryId?: string | number | null;
    parentId?: string | number | null;
    deadline?: string;
    executors?: { id: string | number }[] | null;
    hasUncompletedChildren?: boolean;
}

interface TaskStore {
    tasks: TaskNode[];
    users: UserNode[];
    categories: CategoryNode[];
    isLoading: boolean;
    error: string | null;

    fetchTasks: () => Promise<void>;
    updateTask: (input: UpdateTaskInput) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    createTask: (input: CreateTaskInput) => Promise<boolean>;

    // Нові функції для категорій
    createCategory: (name: string) => Promise<boolean>;
    deleteCategory: (id: number) => Promise<boolean>;

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

const GET_TASKS_AND_LOOKUPS_QUERY = `
  query GetTasksAndLookups {
    tasks {
      id title content isCompleted deadline categoryId parentId hasUncompletedChildren
      executors {
        id
      }
    }
    categories {
      id name
    }
    users {
      id username email
    }
  }
`;

const UPDATE_TASK_MUTATION = `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) { 
      id title content isCompleted deadline categoryId parentId hasUncompletedChildren
      executors {
        id
      }
    }
  }
`;

const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) { 
      id title content isCompleted deadline categoryId parentId hasUncompletedChildren
      executors {
        id
      }
    }
  }
`;

const DELETE_TASK_MUTATION = `
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;

// НОВІ МУТАЦІЇ ДЛЯ КАТЕГОРІЙ
const CREATE_CATEGORY_MUTATION = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY_MUTATION = `
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

const buildTaskTree = (flatTasks: FlatTask[]): TaskNode[] => {
    if (!Array.isArray(flatTasks)) return [];

    const taskMap = new Map<string, TaskNode>();
    const tree: TaskNode[] = [];

    flatTasks.forEach(task => {
        if (!task) return;
        const stringId = task.id.toString();
        taskMap.set(stringId, {
            id: stringId,
            title: task.title || 'Без назви',
            text: task.content || '',
            status: task.isCompleted ? 'done' : 'todo',
            categoryId: task.categoryId ? task.categoryId.toString() : null,
            parentId: task.parentId ? task.parentId.toString() : null,
            deadline: task.deadline ? task.deadline : undefined,
            executorIds: task.executors ? task.executors.map(e => e.id.toString()) : [],
            hasUncompletedChildren: task.hasUncompletedChildren || false,
            children: []
        });
    });

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
    users: [],
    categories: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ query: GET_TASKS_AND_LOOKUPS_QUERY }),
            });
            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const tasksTree = buildTaskTree(result.data.tasks || []);
            set({
                tasks: tasksTree,
                categories: result.data.categories || [],
                users: result.data.users || [],
                isLoading: false
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка завантаження';
            console.error('Помилка завантаження:', errorMessage);
            set({ error: errorMessage, isLoading: false });
        }
    },

    createTask: async (input) => {
        set({ isLoading: true, error: null });
        try {
            const payload = {
                ...input,
                content: stringHasValue(input.content) ? input.content : ' '
            };

            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: CREATE_TASK_MUTATION,
                    variables: { input: payload }
                }),
            });
            const result = await response.json();

            if (result.errors) {
                alert(`Помилка бекенду: ${result.errors[0].message}`);
                throw new Error(result.errors[0].message);
            }

            await useTaskStore.getState().fetchTasks();

            const createdData = result.data.createTask;
            const newTask: TaskNode = {
                id: createdData.id.toString(),
                title: createdData.title || 'Нове завдання',
                text: createdData.content || '',
                status: createdData.isCompleted ? 'done' : 'todo',
                categoryId: createdData.categoryId ? createdData.categoryId.toString() : null,
                parentId: createdData.parentId ? createdData.parentId.toString() : null,
                deadline: createdData.deadline ? createdData.deadline : undefined,
                executorIds: createdData.executors ? createdData.executors.map((e: { id: string | number }) => e.id.toString()) : [],
                hasUncompletedChildren: createdData.hasUncompletedChildren || false,
            };

            set({ selectedTask: newTask, isCreateModalOpen: false, isLoading: false, isEditingTask: false });
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка створення';
            console.error('Помилка створення:', errorMessage);
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    updateTask: async (input) => {
        set({ isLoading: true, error: null });
        try {
            const payload = {
                ...input,
                content: stringHasValue(input.content) ? input.content : ' '
            };

            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: UPDATE_TASK_MUTATION,
                    variables: { input: payload }
                }),
            });
            const result = await response.json();

            if (result.errors) {
                alert(`Помилка бекенду: ${result.errors[0].message}`);
                throw new Error(result.errors[0].message);
            }

            await useTaskStore.getState().fetchTasks();
            set({ isEditingTask: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення';
            console.error('Помилка оновлення:', errorMessage);
            set({ error: errorMessage, isLoading: false });
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: DELETE_TASK_MUTATION,
                    variables: { id }
                }),
            });
            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            const currentSelected = useTaskStore.getState().selectedTask;
            if (currentSelected && Number(currentSelected.id) === id) {
                set({ selectedTask: null, isEditingTask: false });
            } else {
                set({ isEditingTask: false });
            }

            await useTaskStore.getState().fetchTasks();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка видалення';
            console.error('Помилка видалення:', errorMessage);
            set({ error: errorMessage, isLoading: false });
        }
    },

    // --- ЛОГІКА ДЛЯ КАТЕГОРІЙ ---
    createCategory: async (name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: CREATE_CATEGORY_MUTATION,
                    variables: { input: { name } } // Передаємо саме як об'єкт input
                }),
            });
            const result = await response.json();

            if (result.errors) throw new Error(result.errors[0].message);

            await useTaskStore.getState().fetchTasks(); // Оновлюємо список категорій з бази
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка створення категорії';
            console.error('Помилка створення категорії:', errorMessage);
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5148/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    query: DELETE_CATEGORY_MUTATION,
                    variables: { id } // Видалення приймає просто id (Int!)
                }),
            });
            const result = await response.json();
            if (result.errors) throw new Error(result.errors[0].message);

            await useTaskStore.getState().fetchTasks(); // Оновлюємо список
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Помилка видалення категорії';
            console.error('Помилка видалення категорії:', errorMessage);
            set({ error: errorMessage, isLoading: false });
            return false;
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

function stringHasValue(str?: string): boolean {
    return Boolean(str && str.trim().length > 0);
}
