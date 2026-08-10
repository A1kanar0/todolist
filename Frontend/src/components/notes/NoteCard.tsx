export interface NoteCardProps {
    id?: string | number;
    text: string;
    author: string;
    tags?: { label: string; color: string }[];
    variant?: 'compact' | 'grid';
    isSelected?: boolean;
    onClick?: () => void;
}

export default function NoteCard({
                                         text,
                                         tags = [],
                                         author,
                                         variant = 'compact',
                                         isSelected,
                                         onClick
                                     }: NoteCardProps) {

    // Перевіряємо, чи це компактний варіант
    const isCompact = variant === 'compact';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all
                ${isSelected
                ? 'bg-purple-50/50 border-2 border-[#A890F0] shadow-md' // Стиль активної картки
                : isCompact
                    ? 'bg-gray-200/60 border-2 border-transparent' // Компактний стиль
                    : 'bg-white border-2 border-transparent border-gray-200 shadow-sm hover:shadow-md' // Звичайний стиль
            }
            `}
        >
            {/* Верхня частина */}
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="font-extrabold text-gray-900 text-lg">Note</span>

                    <div className="flex gap-1.5 flex-wrap justify-end">
                        {tags?.map((tag, index) => (
                            <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                                {tag.label}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {text}
                </p>
            </div>

            {/* Нижня частина: Іконка та Автор */}
            <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
                <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-xs font-bold text-gray-500">{author}</span>
            </div>
        </div>
    );
}
