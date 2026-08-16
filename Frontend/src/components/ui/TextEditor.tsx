import { useRef, useEffect, useState } from 'react';

interface TextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function TextEditor({ value, onChange, placeholder = 'Введіть детальний опис...' }: TextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // Стейт для відстеження активних кнопок
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    // Вставляємо початковий текст при завантаженні (тільки якщо він відрізняється)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    // Передаємо змінений HTML наверх
    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Перевіряємо, які стилі застосовані в місці знаходження курсору
    const checkActiveFormats = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
        });
    };

    // Обробник кнопок форматування
    const handleFormat = (e: React.MouseEvent, command: string, url?: string) => {
        e.preventDefault(); // Запобігає втраті фокусу з тексту
        document.execCommand(command, false, url);
        handleInput();
        checkActiveFormats(); // Одразу оновлюємо стан після кліку
    };

    // Допоміжна функція для генерації стилів кнопок
    const getButtonClass = (isActive: boolean, baseClass: string) => {
        return `w-8 h-8 flex items-center justify-center rounded transition-all ${baseClass} ${
            isActive
                ? 'bg-[#A890F0]/20 text-[#A890F0]'
                : 'text-gray-600 hover:bg-gray-200 hover:text-[#A890F0]'
        }`;
    };

    return (
        <div className="flex-1 flex flex-col mb-4 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#A890F0] transition-all bg-white">
            {/* Панель інструментів */}
            <div className="flex gap-1.5 p-2 bg-gray-100 border-b border-gray-200 items-center">
                <button
                    onMouseDown={(e) => handleFormat(e, 'bold')}
                    className={getButtonClass(activeFormats.bold, 'font-bold')}
                    title="Жирний"
                >
                    B
                </button>
                <button
                    onMouseDown={(e) => handleFormat(e, 'italic')}
                    className={getButtonClass(activeFormats.italic, 'italic font-serif')}
                    title="Курсив"
                >
                    I
                </button>
                <button
                    onMouseDown={(e) => handleFormat(e, 'underline')}
                    className={getButtonClass(activeFormats.underline, 'underline')}
                    title="Підкреслений"
                >
                    U
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1.5"></div>

                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt('Введіть посилання (з http/https):');
                        if (url) handleFormat(e, 'createLink', url);
                    }}
                    className={getButtonClass(false, 'text-lg')}
                    title="Посилання"
                >
                    🔗
                </button>
                <button
                    className={getButtonClass(false, 'text-lg')}
                    title="Зображення"
                >
                    📷
                </button>
                <span className="ml-auto text-xs text-gray-400 font-medium px-2">WYSIWYG Editor</span>
            </div>

            {/* Робоче поле */}
            <div
                ref={editorRef}
                contentEditable
                onInput={() => {
                    handleInput();
                    checkActiveFormats();
                }}
                onKeyUp={checkActiveFormats}
                onMouseUp={checkActiveFormats}
                onClick={checkActiveFormats}
                // ДОДАНО: [&_a]:text-[#A890F0] [&_a]:underline [&_a]:font-medium
                className="flex-1 w-full p-4 outline-none overflow-y-auto custom-scrollbar min-h-[150px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 [&_a]:text-[#A890F0] [&_a]:underline [&_a]:font-medium [&_a]:hover:text-[#967deb]"
                data-placeholder={placeholder}
                style={{ outline: 'none' }}
            />
        </div>
    );
}
