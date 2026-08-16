interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }: SearchInputProps) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A890F0] focus:ring-1 focus:ring-[#A890F0] shadow-sm transition-all ${className}`}
        />
    );
}
