import React, { useState } from 'react';

type ModalProps = {
  board: { _id: string; title: string; description: string };
  onClose: () => void;
  onUpdate: (updatedBoard: { title: string; description: string }) => void;
  onDelete: () => void;
};

export default function Modal({ board, onClose, onUpdate, onDelete }: ModalProps) {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);

  const handleUpdate = () => {
    onUpdate({ title, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Board</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border mb-2 rounded"
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border mb-2 rounded"
          placeholder="Description"
        ></textarea>
        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
