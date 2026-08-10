import TagPill from './TagPill';

interface NoteCardProps {
    text: string;
    tags: { label: string; color: string }[];
    author: string;
    variant?: 'compact' | 'grid';
}

export default function HomeNoteCard({ text, tags, author, variant = 'compact' }: NoteCardProps) {
    // Якщо варіант compact - робимо картку меншою та сірішою, якщо grid - білою та більшою
    const isCompact = variant === 'compact';

    return (
        <div className={`rounded-xl p-4 mb-4 flex flex-col ${isCompact ? 'bg-gray-200/60' : 'bg-white border border-gray-200 shadow-sm'}`}>
            {/* Верхній рядок: Заголовок "Note" та Теги */}
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800 text-lg">Note</span>
                <div className="flex gap-1 flex-wrap justify-end">
                    {tags.map((tag, index) => (
                        <TagPill key={index} label={tag.label} colorClass={tag.color} />
                    ))}
                </div>
            </div>

            {/* Текст нотатки */}
            <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                {text}
            </p>

            {/* Нижній рядок: Іконка та Автор */}
            <div className="mt-auto flex justify-between items-end">
                <div className="text-gray-400">
                    {/* Проста іконка картинки (заглушка) */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-xs font-semibold text-gray-500">{author}</span>
            </div>
        </div>
    );
}
