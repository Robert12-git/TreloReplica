"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ListColumn from "@/components/ListColumn";
import posthog from "posthog-js";

type Card = {
  _id: string;
  title: string;
  description?: string;
};

type List = {
  _id: string;
  name: string;
  cards: Card[];
};

type Board = {
  _id: string;
  title: string;
  description: string;
  lists: List[];
};

export default function BoardPage() {
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [newListName, setNewListName] = useState<string>("");

  useEffect(() => {
    const startTime = Date.now();

    if (!router.isReady) return;

    const fetchBoard = async () => {
      const { id } = router.query;
      try {
        const response = await axios.get(`/api/boards/${id}`);
        setBoard(response.data.data);
      } catch (error) {
        console.error("Failed to fetch board:", error);
        router.push("/");
      }
    };

    fetchBoard();

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (board?._id) {
        posthog.capture("time_spent_on_board", {
          board_id: board._id,
          duration,
        });
      }
    };
  }, [router.isReady, router.query, board?._id]);

  const addList = async () => {
    if (!newListName || !board) return;

    try {
      const response = await axios.post(`/api/boards/${board._id}/lists`, {
        name: newListName,
      });
      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: [...prevBoard!.lists, response.data.data],
      }));
      setNewListName("");

      posthog.capture("list_created", {
        list_id: response.data.data.insertedId,
        board_id: board._id,
      });
    } catch (error) {
      console.error("Failed to add list:", error);
    }
  };

  const handleUpdateList = async (listId: string, newName: string) => {
    if (!board) return;

    try {
      await axios.put(`/api/boards/${board._id}/lists/${listId}`, {
        name: newName,
      });
      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: prevBoard!.lists.map((list) =>
          list._id === listId ? { ...list, name: newName } : list
        ),
      }));

      posthog.capture("list_edited", {
        list_id: listId,
        changes: newName,
      });
    } catch (error) {
      console.error("Failed to update list:", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!board) return;

    try {
      await axios.delete(`/api/boards/${board._id}/lists/${listId}`);
      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: prevBoard!.lists.filter((list) => list._id !== listId),
      }));

      posthog.capture("list_deleted", { list_id: listId });
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const handleAddCard = async (listId: string) => {
    if (!board) return;

    const cardTitle = prompt("Enter card title:");
    if (!cardTitle) return;

    try {
      const response = await axios.post(
        `/api/boards/${board._id}/lists/${listId}/cards`,
        {
          title: cardTitle,
        }
      );

      const newCard = response.data.data;

      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: prevBoard!.lists.map((list) =>
          list._id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
      }));

      posthog.capture("card_created", {
        card_id: newCard.insertedId,
        list_id: listId,
        board_id: board._id,
      });
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  const handleEditCard = async (
    listId: string,
    cardId: string,
    updatedCard: Card
  ) => {
    if (!updatedCard.title || !board) return;

    try {
      await axios.put(
        `/api/boards/${board._id}/lists/${listId}/cards/${cardId}`,
        {
          title: updatedCard.title,
          description: updatedCard.description,
        }
      );

      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: prevBoard!.lists.map((list) =>
          list._id === listId
            ? {
                ...list,
                cards: list.cards.map((card) =>
                  card._id === cardId
                    ? {
                        ...card,
                        title: updatedCard.title,
                        description: updatedCard.description,
                      }
                    : card
                ),
              }
            : list
        ),
      }));

      posthog.capture("card_edited", {
        card_id: cardId,
        changes: updatedCard,
      });
    } catch (error) {
      console.error("Failed to edit card:", error);
    }
  };


  const handleDeleteCard = async (listId: string, cardId: string) => {
    if (!confirm("Are you sure you want to delete this card?") || !board) return;

    try {
      await axios.delete(
        `/api/boards/${board._id}/lists/${listId}/cards/${cardId}`
      );

      setBoard((prevBoard) => ({
        ...prevBoard!,
        lists: prevBoard!.lists.map((list) =>
          list._id === listId
            ? {
                ...list,
                cards: list.cards.filter((card) => card._id !== cardId),
              }
            : list
        ),
      }));

      posthog.capture("card_deleted", { card_id: cardId, list_id: listId });
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };


  if (!board) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      <p className="text-gray-600 mb-8">{board.description}</p>

      <div className="flex space-x-4">
        {board.lists && board.lists.map((list) => (
          <ListColumn
            key={list._id}
            list={list}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onUpdateList={(listId, newName) =>
              handleUpdateList(listId, newName)
            }
            onDeleteList={(listId) => handleDeleteList(listId)}
          />
        ))}

        <div className="w-64 p-4 bg-gray-200 rounded shadow">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="w-full p-2 border mb-2 rounded"
          />
          <button
            onClick={addList}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add List
          </button>
        </div>
      </div>
    </div>
  );
}
