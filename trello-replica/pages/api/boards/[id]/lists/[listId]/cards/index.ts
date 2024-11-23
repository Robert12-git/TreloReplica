import { Board } from '@/lib/models/Board';
import { ObjectId } from 'mongodb';
import client from '@/lib/mongodb';


export default async function handler(req, res) {
  const { id, listId } = req.query;
  const { title } = req.body;

  if (!title) return res.status(400).json({ success: false, error: 'Card title is required' });

  try {
    await client.connect();
    const db = client.db('TrelloReplica');
    const boardsCollection = db.collection<Board>('Boards');

    const newCard = { _id: new ObjectId(), title, description: '' };
    await db.collection('Boards').updateOne(
      { _id: new ObjectId(id), 'lists._id': new ObjectId(listId) },
      { $push: { 'lists.$.cards': newCard } }
    );
    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
