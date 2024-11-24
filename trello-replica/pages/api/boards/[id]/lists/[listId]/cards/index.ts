import { ObjectId, PushOperator } from "mongodb";
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
      description: string;
    }[];
  }[];
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, listId } = req.query;
  const { title } = req.body;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!listId || Array.isArray(listId)) {
    return res.status(400).json({ error: "Invalid listId" });
  }

  if (!title)
    return res
      .status(400)
      .json({ success: false, error: "Card title is required" });

  try {
    await client.connect();
    const db = client.db("TrelloReplica");

    const newCard = { _id: new ObjectId(), title, description: "" };
    await db
      .collection("Boards")
      .updateOne({ _id: new ObjectId(id), "lists._id": new ObjectId(listId) }, {
        $push: { "lists.$.cards": newCard },
      } as PushOperator<BoardDocument>);
    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
