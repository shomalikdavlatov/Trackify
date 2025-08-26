import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button: React.FC<ButtonProps> = ({ label, ...props }) => (
    <button
        {...props}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
    >
        {label}
    </button>
);

export default Button;