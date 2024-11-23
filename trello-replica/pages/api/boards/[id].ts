import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    await client.connect();
    const db = client.db('TrelloReplica');
    const collection = db.collection('Boards');

    switch (method) {
      case 'GET': // Fetch a board by ID
        const board = await collection.findOne({ _id: new ObjectId(id) });
        if (!board) {
          return res.status(404).json({ success: false, error: 'Board not found' });
        }
        res.status(200).json({ success: true, data: board });
        break;

      case 'PUT': // Update a board by ID
        const { title, description } = req.body;
        const resultUpdate = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title: title, description: description } }
        );

        res.status(200).json({ success: true, data: resultUpdate });
        break;

      case 'DELETE': // Delete a board by ID
        const resultDelete = await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ success: true, data: resultDelete });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
