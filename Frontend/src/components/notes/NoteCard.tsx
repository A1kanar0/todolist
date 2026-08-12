export interface NoteCardProps {
    id?: string | number;
    title?: string;
    text: string;
    author: string;
    tags?: { name: string; color: string }[];
    variant?: 'compact' | 'grid'; // Повертаємо назад
    isSelected?: boolean;
    onClick?: () => void;
}

export default function NoteCard({
                                     title,
                                     text,
                                     tags = [],
                                     author,
                                     variant = 'compact',
                                     isSelected,
                                     onClick
                                 }: NoteCardProps) {

    // Створюємо динамічні класи залежно від variant
    const isCompact = variant === 'compact';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-2xl flex flex-col justify-between transition-all border-2 group
                ${isCompact ? 'p-4 min-h-[160px]' : 'p-5 min-h-[220px]'} 
                ${isSelected
                ? 'bg-purple-50/50 border-[#A890F0] shadow-md'
                : 'bg-white border-gray-200 hover:border-[#A890F0] shadow-sm hover:shadow-md'
            }
            `}
        >
            {/* Верхня частина */}
            <div>
                <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
                    <span className={`font-extrabold transition-colors 
                        ${isCompact ? 'text-base' : 'text-lg'}
                        ${isSelected ? 'text-[#A890F0]' : 'text-gray-900 group-hover:text-[#7E69AB]'}
                    `}>
                        {title || 'Без назви'}
                    </span>

                    {/* Якщо компактний режим - можна ховати теги або показувати менше */}
                    {!isCompact && (
                        <div className="flex gap-1.5 flex-wrap justify-end">
                            {tags?.map((tag, index) => (
                                <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-bold ${tag.color}`}>
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <p className={`text-gray-600 leading-relaxed ${isCompact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-4'}`}>
                    {text}
                </p>
            </div>

            {/* Нижня частина: Іконка та Автор */}
            <div className={`mt-auto flex justify-between items-end border-t border-gray-100 ${isCompact ? 'pt-2' : 'pt-4'}`}>
                <div className="text-gray-400">
                    <svg className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className={`font-bold text-gray-500 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>{author}</span>
            </div>
        </div>
    );
}
