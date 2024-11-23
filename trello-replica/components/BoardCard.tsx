import { MouseEventHandler } from "react";

type Board = {
  _id: string;
  title: string;
  description: string;
};

type BoardCardProps = {
  board: Board;
  onClick: MouseEventHandler<HTMLDivElement>,
  onEdit: MouseEventHandler<HTMLButtonElement>
};

export default function BoardCard({ board, onClick, onEdit }: BoardCardProps) {
  return (
    <div
      key={board._id}
      className="relative p-4 border rounded shadow-sm bg-white hover:shadow-md transition-shadow"
      onClick={onClick}
    >
        <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the parent click handler from triggering
          onEdit(e); // Trigger the edit handler
        }} // Trigger the modal
        className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Edit
      </button>
      <h2 className="text-xl font-semibold">{board.title}</h2>
      <p className="text-gray-600">{board.description}</p>
      
    </div>
  );
}
