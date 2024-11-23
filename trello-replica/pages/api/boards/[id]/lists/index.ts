import { Board, List } from '@/lib/models/Board';
import { ObjectId } from 'mongodb';
import client from '@/lib/mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    await client.connect();
    const db = client.db('TrelloReplica');
    const boardsCollection = db.collection<Board>('Boards');

    switch (method) {
      case 'GET':
        const board = await boardsCollection.findOne({ _id: new ObjectId(id) });
        if (!board) return res.status(404).json({ success: false, error: 'Board not found' });
        res.status(200).json({ success: true, data: board.lists });
        break;

      case 'POST':
        const { name }: { name: string } = req.body;
        if (!name) return res.status(400).json({ success: false, error: 'List name is required' });

        const newList: List = { _id: new ObjectId(), name, cards: [] };
        const updateResult = await boardsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { lists: newList } }
        );

        if (!updateResult.matchedCount) return res.status(404).json({ success: false, error: 'Board not found' });
        res.status(201).json({ success: true, data: newList });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
