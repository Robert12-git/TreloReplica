import { ObjectId, PullOperator } from "mongodb";
import client from "@/lib/mongodb";

import { NextApiRequest, NextApiResponse } from "next";

type BoardDocument = {
  _id: ObjectId;
  lists: {
    _id: ObjectId;
    name: string;
    cards: {
      _id: ObjectId;
      title: string;
      description?: string;
    }[];
  }[];
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id, listId, cardId } = req.query;
  const { title, description } = req.body;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!listId || Array.isArray(listId)) {
    return res.status(400).json({ error: "Invalid listId" });
  }

  if (!cardId || Array.isArray(cardId)) {
    return res.status(400).json({ error: "Invalid cardId" });
  }

  try {
    await client.connect();
    const db = client.db("TrelloReplica");
    const boardsCollection = db.collection("Boards");

    switch (method) {
      case "PUT": {
        await boardsCollection.updateOne(
          {
            _id: new ObjectId(id),
            "lists._id": new ObjectId(listId),
            "lists.cards._id": new ObjectId(cardId),
          },
          {
            $set: {
              "lists.$.cards.$[card].title": title,
              "lists.$.cards.$[card].description": description,
            },
          },
          { arrayFilters: [{ "card._id": new ObjectId(cardId) }] }
        );
        res.status(200).json({ success: true });
        break;
      }

      case "DELETE": {
        await boardsCollection.updateOne(
          { _id: new ObjectId(id), "lists._id": new ObjectId(listId) },
          {
            $pull: { "lists.$.cards": { _id: new ObjectId(cardId) } },
          } as PullOperator<BoardDocument>
        );
        res.status(200).json({ success: true });
      }

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in cards API:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
