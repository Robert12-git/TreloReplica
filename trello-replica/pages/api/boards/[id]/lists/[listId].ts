import { ObjectId, PullOperator } from 'mongodb';
import client from '@/lib/mongodb';

import { NextApiRequest, NextApiResponse } from "next";

type BoardDocument = {
  _id: ObjectId;
  lists: { _id: ObjectId; name: string }[]; // Define `lists` as an array of objects
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id, listId } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!listId || Array.isArray(listId)) {
    return res.status(400).json({ error: "Invalid listId" });
  }

  try {
    await client.connect();
    const db = client.db("TrelloReplica");
    const boardsCollection = db.collection("Boards");

    switch (method) {
      case "PUT": {
        // Rename a specific list
        const { name } = req.body;
        if (!name) {
          return res
            .status(400)
            .json({ success: false, error: "List name is required" });
        }

        const result = await boardsCollection.updateOne(
          { _id: new ObjectId(id), "lists._id": new ObjectId(listId) },
          { $set: { "lists.$.name": name } }
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Board or list not found" });
        }

        res.status(200).json({ success: true, data: { listId, name } });
        break;
      }

      case "DELETE": {
        // Delete a specific list
        const result = await boardsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $pull: { lists: { _id: new ObjectId(listId) } } } as PullOperator<BoardDocument>
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Board or list not found" });
        }

        res
          .status(200)
          .json({ success: true, message: "List deleted successfully" });
        break;
      }

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in lists API:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
