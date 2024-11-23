import React, { useState } from "react";
import CardItem from "./CardItem";
import CardModal from "./CardModal";

export default function ListColumn({
  list,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onUpdateList,
  onDeleteList,
}) {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSaveCard = (updatedCard) => {
    onEditCard(list._id, selectedCard._id, updatedCard);
  };

  return (
    <div className="w-64 p-4 bg-gray-100 rounded shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">{list.name}</h3>
        <div>
          <button
            onClick={() => {
              const newName = prompt("Enter new list name:", list.name);
              if (newName) onUpdateList(list._id, newName);
            }}
            className="text-blue-500 hover:underline"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteList(list._id)}
            className="text-red-500 hover:underline"
          >
            🗑️
          </button>
        </div>
      </div>
      <div>
        {list.cards.map((card) => (
          <CardItem
            key={card._id}
            card={card}
            onClick={() => setSelectedCard(card)}
          />
        ))}
      </div>
      <button
        onClick={() => onAddCard(list._id)}
        className="mt-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Add Card
      </button>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSave={(updatedCard) => handleSaveCard(updatedCard)}
          onDelete={() => {
            onDeleteCard(list._id, selectedCard._id);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}

