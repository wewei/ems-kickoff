// Import the express in typescript file
import express from 'express';
import { register } from './db';
import bodyParser from 'body-parser'; 

// Initialize the express engine
const app: express.Application = express();

app.use(bodyParser.json({ limit: "1mb" }));
 
// Take a port 3000 for running server.
const port: number = Number.parseInt(process.env.PORT || "3000");
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express.");
});

app.post('/api/register', async (req, res) => {
    const { userId, deviceId } = req.body as { userId: string; deviceId: string };
    const ua = req.get('User-Agent') || "Unknown UA";

    const oldUserId = await register(userId, deviceId, ua);

    return res.json({ oldUserId });
});
 
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});