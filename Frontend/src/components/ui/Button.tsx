import React from 'react';

// Розширюємо стандартні пропси кнопки (щоб працювали onClick, disabled, type тощо)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'sidebar' | 'danger';
    icon?: React.ReactNode;
}

export default function Button({
                                   children,
                                   variant = 'primary',
                                   icon,
                                   className = '',
                                   ...props
                               }: ButtonProps) {

    // Базові стилі, які є у всіх кнопок (шрифт, анімація, курсор)
    const baseStyles = "transition-all font-semibold flex items-center gap-2 cursor-pointer";

    // Словник стилів для різних варіантів кнопок
    const variants = {
        primary: "bg-[#A890F0] hover:bg-[#967deb] text-white py-2.5 px-5 rounded-xl shadow-sm justify-center",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-6 rounded-xl justify-center",
        // Повернули світлий ховер hover:bg-gray-50 для ідеального злиття з фоном
        sidebar: "w-full px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl justify-start",
        danger: "bg-red-500 hover:bg-red-600 text-white py-2.5 px-5 rounded-xl shadow-sm justify-center"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
