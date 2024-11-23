import client from '@/lib/mongodb';

export default async function handler(req, res) {
    const { method } = req;

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db('TrelloReplica'); // Replace with your database name
        const collection = db.collection('Boards');

        switch (method) {
            case 'GET': // Fetch all boards
                const boards = await collection.find({}).toArray();
                res.status(200).json({ success: true, data: boards });
                break;

            case 'POST': // Add a new board
                var { title, description } = req.body;
                var result = await collection.insertOne({ title, description, createdAt: new Date() });
                res.status(201).json({ success: true, data: result });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
