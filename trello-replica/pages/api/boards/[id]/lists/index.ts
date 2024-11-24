import { ObjectId, PushOperator } from 'mongodb';
import client from '@/lib/mongodb';

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
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    await client.connect();
    const db = client.db("TrelloReplica");
    const boardsCollection = db.collection("Boards");

    switch (method) {
      case "GET":
        const board = await boardsCollection.findOne({ _id: new ObjectId(id) });
        if (!board)
          return res
            .status(404)
            .json({ success: false, error: "Board not found" });
        res.status(200).json({ success: true, data: board.lists });
        break;

      case "POST":
        const { name }: { name: string } = req.body;
        if (!name)
          return res
            .status(400)
            .json({ success: false, error: "List name is required" });

        const newList = { _id: new ObjectId(), name, cards: [] };
        const updateResult = await boardsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { lists: newList } } as PushOperator<BoardDocument>
        );

        if (!updateResult.matchedCount)
          return res
            .status(404)
            .json({ success: false, error: "Board not found" });
        res.status(201).json({ success: true, data: newList });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
