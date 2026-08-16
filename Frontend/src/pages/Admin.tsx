import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export default function Admin() {
    const categories = useTaskStore((state) => state.categories);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const createCategory = useTaskStore((state) => state.createCategory);
    const deleteCategory = useTaskStore((state) => state.deleteCategory);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Підтягуємо дані, якщо юзер зайшов на цю сторінку напряму
    useEffect(() => {
        if (categories.length === 0) {
            fetchTasks();
        }
    }, [categories.length, fetchTasks]);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setIsCreating(true);
        const success = await createCategory(newCategoryName.trim());
        if (success) {
            setNewCategoryName('');
        } else {
            alert('Не вдалося створити категорію. Перевір консоль.');
        }
        setIsCreating(false);
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити категорію "${name}"?`)) {
            const success = await deleteCategory(Number(id));
            if (!success) {
                alert('Помилка при видаленні категорії.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
            <div className="mb-8 shrink-0">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Panel</h1>
                <p className="text-gray-500 mt-2">Керування глобальними налаштуваннями додатку.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                {/* Блок керування категоріями */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Категорії завдань</h2>
                            <p className="text-sm text-gray-500 mt-1">Додавайте та видаляйте категорії, які будуть доступні всім користувачам.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                            placeholder="Назва нової категорії..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#A890F0] focus:bg-white focus:ring-2 focus:ring-[#A890F0]/20 transition-all font-medium text-gray-800"
                        />
                        <button
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || isCreating}
                            className="px-6 py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                        >
                            {isCreating ? 'Створення...' : '+ Створити'}
                        </button>
                    </div>

                    {/* Список існуючих категорій з можливістю видалення */}
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                            Існуючі категорії ({categories.length})
                        </span>
                        {categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <div
                                        key={category.id}
                                        className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2 group transition-colors hover:border-red-200"
                                    >
                                        <span>📁</span>
                                        {category.name}
                                        <button
                                            onClick={() => handleDeleteCategory(category.id, category.name)}
                                            className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Видалити"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 text-sm italic">Категорій поки немає.</div>
                        )}
                    </div>
                </div>

                {/* Місце для майбутніх налаштувань */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[150px]">
                    <span className="text-gray-400 font-medium">Тут будуть інші налаштування...</span>
                </div>
            </div>
        </div>
    );
}
