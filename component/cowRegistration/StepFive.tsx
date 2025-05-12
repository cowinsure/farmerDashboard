import React, { useState } from 'react';
import { FaTrash } from "react-icons/fa";

interface Attachment {
    id: number;
    title: string;
    file: File | null;
}

const StepFive: React.FC = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);


    console.log(attachments);
    

    const handleAddAttachment = () => {
        setAttachments([
            ...attachments,
            { id: Date.now(), title: '', file: null },
        ]);
    };

    const handleTitleChange = (id: number, title: string) => {
        setAttachments(
            attachments.map((attachment) =>
                attachment.id === id ? { ...attachment, title } : attachment
            )
        );
    };

    const handleFileChange = (id: number, file: File | null) => {
        setAttachments(
            attachments.map((attachment) =>
                attachment.id === id ? { ...attachment, file } : attachment
            )
        );
    };

    const handleRemoveAttachment = (id: number) => {
        setAttachments(attachments.filter((attachment) => attachment.id !== id));
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attachments</h2>
            {attachments.map((attachment) => (
            <div
                key={attachment.id}
                className="flex flex-col gap-3 items-center mb-4 space-x-4 bg-white p-3 rounded-lg shadow-sm"
            >
                <input
                    type="text"
                    placeholder="Enter title"
                    value={attachment.title}
                    onChange={(e) =>
                        handleTitleChange(attachment.id, e.target.value)
                    }
                    className="w-1/1  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    onChange={(e) =>
                        handleFileChange(
                            attachment.id,
                            e.target.files ? e.target.files[0] : null
                        )
                    }
                    className="w-1/1  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="w-1/1 flex justify-center  px-4 py-2 text-center bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <FaTrash size={24} className='text-center'/>
                </button>
            </div>
            ))}
            <button
            onClick={handleAddAttachment}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
            Add Attachment
            </button>
        </div>
    );
};

export default StepFive;