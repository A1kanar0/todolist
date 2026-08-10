interface TaskItemProps {
    title: string;
    executors?: string;
    text: string;
    category: string;
    deadline: string;
}

export default function TaskItem({ title, executors, text, category, deadline }: TaskItemProps) {
    const isUrgent = deadline === '1 day';

    return (
        <div className="border-b border-gray-200 py-4 mb-2">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-gray-900 text-lg">{title}</span>
                    {executors && (
                        <span className="text-gray-500 text-sm ml-2 border-l border-gray-300 pl-2">
              {executors}
            </span>
                    )}
                </div>
                <span className="text-gray-500 text-sm italic">{category}</span>
            </div>

            <div className="flex justify-between items-end">
                <p className="text-gray-600 text-sm max-w-[70%] leading-relaxed">
                    {text}
                </p>
                <span className={`text-sm font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-500'}`}>
          {deadline}
        </span>
            </div>
        </div>
    );
}
