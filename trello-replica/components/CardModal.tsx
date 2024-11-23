import React, { useState } from "react";

type CardModalProps = {
  card: { _id: string; title: string; description: string };
  onClose: () => void;
  onSave: (updatedCard: { title: string; description: string }) => void;
  onDelete: () => void;
};

export default function CardModal({
  card,
  onClose,
  onSave,
  onDelete,
}: CardModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");

  const handleSave = () => {
    onSave({ title, description });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Card" : "Card Details"}
        </h2>
        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="block w-full p-3 border mb-4 rounded text-lg"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="block w-full p-3 border mb-4 rounded text-lg"
              rows={5}
            ></textarea>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 text-base mb-6">{description}</p>
          </>
        )}

        <div className="flex justify-between items-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this card?")) {
                onDelete();
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-3 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
