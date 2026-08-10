interface TagPillProps {
    label: string;
    colorClass: string; // Наприклад: 'bg-purple-200 text-purple-800'
}

export default function TagPill({ label, colorClass }: TagPillProps) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
    );
}
