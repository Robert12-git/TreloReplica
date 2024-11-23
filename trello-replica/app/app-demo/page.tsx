'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BoardCard from '@/components/BoardCard';
import Modal from '@/components/Modal';
import posthog from 'posthog-js';

type Board = {
  _id: string;
  title: string;
  description: string;
};

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const router = useRouter();

  // Fetch boards from the server
  const fetchBoards = async () => {
    try {
      const response = await axios.get('/api/boards');
      setBoards(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    }
  };

  // Fetch boards on initial load
  useEffect(() => {
    fetchBoards();
  }, []);

  const navigateToBoard = (id: string) => {
    router.push(`/boards/${id}`);
    posthog.capture("board_selected", {
      board_id: id,
    });
  };

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      var result = await axios.post('/api/boards', newBoard);
      setNewBoard({ title: '', description: '' });
      await fetchBoards();
      posthog.capture("board_created", {
        board_id: result.data.data.insertedId,
      });
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleUpdateBoard = async (id: string, updatedBoard: { title: string; description: string }) => {
    await axios.put(`/api/boards/${id}`, updatedBoard);
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board._id === id ? { ...board, ...updatedBoard } : board
      )
    );

    posthog.capture("board_edited", {
      board_id: id,
      changes: updatedBoard,
    });
  };

  const handleDeleteBoard = async (id: string) => {
    await axios.delete(`/api/boards/${id}`); // Delete on backend
    setBoards((prevBoards) => prevBoards.filter((board) => board._id !== id)); // Update frontend
    setSelectedBoard(null);

    posthog.capture("board_deleted", { board_id: id });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>

      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onClick={() => navigateToBoard(board._id)}
              onEdit={() => setSelectedBoard(board)} />
          ))}
        </div>
      ) : (
        <p>No boards found. Add one below!</p>
      )}

      {selectedBoard && (
        <Modal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onUpdate={(updatedBoard) => handleUpdateBoard(selectedBoard._id, updatedBoard)}
          onDelete={() => handleDeleteBoard(selectedBoard._id)}
        />
      )}

      <form onSubmit={handleAddBoard} className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Create a New Board</h2>
        <input
          type="text"
          value={newBoard.title}
          onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
          placeholder="Board Title"
          className="block w-full p-2 border mb-2 rounded"
          required
        />
        <textarea
          value={newBoard.description}
          onChange={(e) =>
            setNewBoard({ ...newBoard, description: e.target.value })
          }
          placeholder="Board Description"
          className="block w-full p-2 border mb-2 rounded"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Board
        </button>
      </form>
    </div>
  );
}
