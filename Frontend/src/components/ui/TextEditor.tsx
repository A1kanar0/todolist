interface TextEditorProps {
    defaultValue?: string;
    placeholder?: string;
}

export default function TextEditor({ defaultValue = '', placeholder = 'Введіть детальний опис...' }: TextEditorProps) {
    return (
        <div className="flex-1 flex flex-col mb-4 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#A890F0] transition-all">
            {/* Панель інструментів (заглушка) */}
            <div className="flex gap-3 p-3 bg-gray-100 border-b border-gray-200 text-gray-600">
                <button className="font-bold hover:text-[#A890F0] transition-colors">B</button>
                <button className="italic hover:text-[#A890F0] transition-colors">I</button>
                <button className="underline hover:text-[#A890F0] transition-colors">U</button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button className="hover:text-[#A890F0] transition-colors">🔗</button>
                <button className="hover:text-[#A890F0] transition-colors">📷</button>
                <span className="ml-auto text-xs text-gray-400 font-medium self-center">JSON Editor Placeholder</span>
            </div>

            <textarea
                defaultValue={defaultValue}
                className="flex-1 w-full p-4 bg-gray-50 outline-none resize-none custom-scrollbar"
                placeholder={placeholder}
            ></textarea>
        </div>
    );
}
