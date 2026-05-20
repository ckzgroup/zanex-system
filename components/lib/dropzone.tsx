// components/Dropzone.tsx
import React from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
    onChange: (files: File[]) => void;
    files: File[];
    accept?: string;
    maxFiles?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({ onChange, files, accept = 'image/*', maxFiles = 5 }) => {
    // @ts-ignore
    const { getRootProps, getInputProps } = useDropzone({ onDrop: (acceptedFiles) => onChange([...files, ...acceptedFiles]), accept, maxFiles, });

    const removeFile = (fileName: string) => {
        const newFiles = files.filter((file) => file.name !== fileName);
        onChange(newFiles);
    };

    return (
        <div
            {...getRootProps()}
            className="p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer"
        >
            <input {...getInputProps()} />
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>Drag 'n' drop some files here, or click to select files</p>

            {files.length > 0 && (
                <ul className="mt-2 space-y-2">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <span className="ml-4">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(file.name)}
                                className="ml-4 p-1 text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropzone;
