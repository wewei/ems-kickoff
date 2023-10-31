// Import the express in typescript file
import express from 'express';
import path from 'path';
import { getAllUsers, register } from './db';
import bodyParser from 'body-parser'; 
import { getLotteryConfig } from './lottery-config';

// Initialize the express engine
const app: express.Application = express();

app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.static(path.resolve(__dirname, "../dist")));
 
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

app.get('/api/users', async (req, res) => {
    const users = await getAllUsers();
    return res.json({
        users: users.map(({ alias, name, team }) => [alias, name, team]),
    });
});

app.get('/api/config', async (req, res) => {
    const lotteryConfig = await getLotteryConfig();
    const users = await getAllUsers();

    return res.json({
        cfgData: lotteryConfig,
        leftUsers: users.map(({ alias, name, team }) => [alias, name, team]),
        luckyData: {},
    });
});
 
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});