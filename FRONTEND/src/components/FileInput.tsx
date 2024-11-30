// src/components/FileInput.tsx
import React from 'react';

interface FileInputProps {
    label: string;
    onFileChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ label, onFileChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
    };

    return (
        <div>
            <label className="block text-gray-700">{label}</label>
            <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
                accept="image/*"
            />
        </div>
    );
};

export default FileInput;
