import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
    </div>
);

export default Input;
