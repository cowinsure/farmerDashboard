import React, { useState } from 'react';

interface Attachment {
    id: number;
    title: string;
    file: File | null;
}

const StepFive: React.FC = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);

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
        <div>
            <h2>Attachments</h2>
            {attachments.map((attachment) => (
                <div key={attachment.id} style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Enter title"
                        value={attachment.title}
                        onChange={(e) => handleTitleChange(attachment.id, e.target.value)}
                        style={{ marginRight: '1rem' }}
                    />
                    <input
                        type="file"
                        onChange={(e) =>
                            handleFileChange(
                                attachment.id,
                                e.target.files ? e.target.files[0] : null
                            )
                        }
                        style={{ marginRight: '1rem' }}
                    />
                    <button onClick={() => handleRemoveAttachment(attachment.id)}>
                        Remove
                    </button>
                </div>
            ))}
            <button onClick={handleAddAttachment}>Add Attachment</button>
        </div>
    );
};

export default StepFive;