// src/components/TextInput.tsx
import React from 'react';

interface TextInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    textarea?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, required, textarea }) => (
    <div>
        <label className="block text-gray-700">{label}</label>
        {textarea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required={required}
            />
        ) : (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required={required}
            />
        )}
    </div>
);

export default TextInput;
