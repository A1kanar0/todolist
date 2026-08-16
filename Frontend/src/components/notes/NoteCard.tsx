export interface NoteCardProps {
    id?: string | number;
    title?: string;
    text: string;
    author: string;
    tags?: { name: string; color: string }[];
    variant?: 'compact' | 'grid';
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

    const isCompact = variant === 'compact';

    // Обмежуємо кількість тегів, щоб вони гарантовано не ламали верстку
    const MAX_TAGS = isCompact ? 1 : 3;
    const visibleTags = tags?.slice(0, MAX_TAGS) || [];
    const hiddenTagsCount = (tags?.length || 0) - MAX_TAGS;
    const hasMoreTags = hiddenTagsCount > 0;

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-2xl flex flex-col justify-between transition-all border-2 group/card
                ${isCompact ? 'p-4 min-h-[160px]' : 'p-5 min-h-[220px]'} 
                ${isSelected
                ? 'bg-purple-50/50 border-[#A890F0] shadow-md'
                : 'bg-white border-gray-200 hover:border-[#A890F0] shadow-sm hover:shadow-md'
            }
            `}
        >
            {/* Верхня частина */}
            <div>
                <div className={`flex flex-col items-start ${isCompact ? 'mb-3 gap-2' : 'mb-4 gap-2.5'}`}>

                    {/* Відображення тегів НАД назвою */}
                    {visibleTags.length > 0 && (
                        <div className="flex flex-wrap justify-start gap-1.5 w-full">
                            {visibleTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className={`rounded-md font-bold whitespace-nowrap ${tag.color} ${
                                        isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                                    }`}
                                >
                                    {tag.name}
                                </span>
                            ))}

                            {/* Кнопка "..." з тултипом */}
                            {hasMoreTags && (
                                <div className="relative group/tooltip flex items-center">
                                    <span
                                        className={`rounded-md font-bold bg-gray-100 text-gray-500 flex items-center justify-center cursor-help transition-colors group-hover/tooltip:bg-gray-200 ${
                                            isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                                        }`}
                                    >
                                        ...
                                    </span>

                                    {/* Випадаючий список тегів при наведенні */}
                                    <div className="absolute left-0 top-full mt-2 hidden group-hover/tooltip:flex flex-col bg-white border border-gray-100 shadow-xl rounded-xl p-3 w-max max-w-[200px] z-20">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Усі теги ({tags.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`rounded-md font-bold px-2 py-1 text-[10px] ${tag.color}`}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Назва займає всю ширину */}
                    <span className={`font-extrabold transition-colors line-clamp-2 w-full
                        ${isCompact ? 'text-base' : 'text-lg'}
                        ${isSelected ? 'text-[#A890F0]' : 'text-gray-900 group-hover/card:text-[#7E69AB]'}
                    `}>
                        {title || 'Без назви'}
                    </span>
                </div>

                {/* Відрендерений HTML з класом prose та стилями для посилань */}
                <div
                    className={`text-gray-600 leading-relaxed prose max-w-none 
                        [&>p]:m-0 [&>p]:inline [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 
                        [&_a]:text-[#A890F0] [&_a]:underline [&_a]:font-medium [&_a]:hover:text-[#967deb]
                        ${isCompact ? 'text-xs prose-sm prose-p:text-xs line-clamp-2' : 'text-sm prose-sm line-clamp-4'}`}
                    dangerouslySetInnerHTML={{ __html: text || '' }}
                />
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
