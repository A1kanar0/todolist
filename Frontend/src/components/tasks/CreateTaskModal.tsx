import { useTaskStore } from '../../store/useTaskStore';

export default function CreateTaskModal() {
    const isCreateModalOpen = useTaskStore((state) => state.isCreateModalOpen);
    const closeCreateModal = useTaskStore((state) => state.closeCreateModal);

    if (!isCreateModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div
                className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Створити нове завдання</h2>

                <div className="flex flex-col gap-4">
                    {/* Головна назва */}
                    <input
                        type="text"
                        placeholder="Назва завдання..."
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold transition-all"
                    />

                    {/* Сітка 2x2 для додаткових параметрів */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Вибір категорії замість текстового інпута */}
                        <select
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold transition-all cursor-pointer"
                            defaultValue=""
                        >
                            <option value="" disabled>Оберіть категорію...</option>
                            {/* Поки хардкодимо кілька категорій для прикладу */}
                            <option value="development">Development</option>
                            <option value="design">Design</option>
                            <option value="management">Management</option>
                            <option value="marketing">Marketing</option>
                        </select>

                        {/* Поле для дедлайну */}
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-500 font-semibold transition-all cursor-pointer"
                        />

                        <input
                            type="text"
                            placeholder="Виконавець..."
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold transition-all"
                        />

                        {/* Вибір батьківського завдання */}
                        <select
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-800 font-semibold transition-all cursor-pointer"
                        >
                            <option value="">Без батьківського (Кореневе)</option>
                            <option value="1">Розробити фронтенд</option>
                            <option value="2">Інтеграція з бекендом</option>
                        </select>
                    </div>

                    {/* Опис */}
                    <textarea
                        placeholder="Детальний опис..."
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#A890F0] text-gray-700 min-h-[120px] resize-none custom-scrollbar transition-all"
                    ></textarea>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={closeCreateModal}
                            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                            Скасувати
                        </button>
                        <button
                            onClick={() => {
                                alert('Тут ми будемо збирати всі ці дані і слати POST-запит на бек!');
                                closeCreateModal();
                            }}
                            className="flex-1 py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-bold rounded-xl transition-colors shadow-sm"
                        >
                            Створити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
