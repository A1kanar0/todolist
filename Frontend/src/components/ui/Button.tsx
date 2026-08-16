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

    // Базові стилі: додали заборонений курсор, прозорість і ч/б фільтр для disabled
    const baseStyles = "transition-all font-semibold flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:grayscale";

    // Словник стилів: додали disabled:hover:... для скасування зміни фону/кольору
    const variants = {
        primary: "bg-[#A890F0] text-white py-2.5 px-5 rounded-xl shadow-sm justify-center hover:bg-[#967deb] disabled:hover:bg-[#A890F0]",
        secondary: "bg-gray-200 text-gray-800 py-2.5 px-6 rounded-xl justify-center hover:bg-gray-300 disabled:hover:bg-gray-200",
        sidebar: "w-full px-4 py-2 text-gray-600 rounded-xl justify-start hover:bg-gray-50 hover:text-gray-900 disabled:hover:bg-transparent disabled:hover:text-gray-600",
        danger: "bg-red-500 text-white py-2.5 px-5 rounded-xl shadow-sm justify-center hover:bg-red-600 disabled:hover:bg-red-500"
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
