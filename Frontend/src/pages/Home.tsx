
import NoteCard from '../components/notes/HomeNoteCard';

export default function Home() {
    // Фейкові дані для перевірки візуалу

    return (
        <div className="flex gap-8 h-full">
            {/* Головна колонка з тасками (займає більшу частину) */}

            {/* Права панель для нотаток (фіксована ширина, сірий фон) */}
            <div className="w-80 bg-[#F3F4F6] rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
                </div>

                {/* Список компактних нотаток */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[
                            { label: '#tag2', color: 'bg-purple-200 text-purple-800' },
                            { label: '#tag1', color: 'bg-yellow-200 text-yellow-800' },
                            { label: '#tag3', color: 'bg-green-200 text-green-800' }
                        ]}
                    />
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[
                            { label: '#tag2', color: 'bg-purple-200 text-purple-800' },
                            { label: '#tag1', color: 'bg-yellow-200 text-yellow-800' },
                            { label: '#tag3', color: 'bg-green-200 text-green-800' }
                        ]}
                    />
                    <NoteCard
                        text="note text note text note text note text note text note text note text note text note text note text note text note text note text..."
                        author="Author"
                        tags={[]}
                    />
                </div>

                <button className="mt-6 w-full py-3 bg-[#A890F0] hover:bg-[#967deb] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span className="text-xl">+</span> Add note
                </button>
            </div>
        </div>
    );
}
