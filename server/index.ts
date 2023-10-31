// Import the express in typescript file
import express from 'express';
import { resolve } from "app-root-path";
import { clearRegisterDB, clearUsersDB, getAllRegister, getAllUsers, register, setAllUsers } from './db';
import bodyParser from 'body-parser'; 
import { getLotteryConfig } from './lottery-config';
import { normalizeTeams, normalizeUsers } from '../shared/user';
import { chain } from 'lodash';

// Initialize the express engine
const app: express.Application = express();

app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.static(resolve("dist")));
 
// Take a port 3000 for running server.
const port: number = Number.parseInt(process.env.PORT || "3000");
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express.");
});

app.post('/api/register', async (req, res) => {
    const { alias, deviceId } = req.body as { alias: string; deviceId: string };
    const ua = req.get('User-Agent') || "Unknown UA";

    console.log(`[API] Registering with alias: ${alias}, deviceId: ${deviceId}, ua: ${ua}`);

    return res.json(await register(alias, deviceId, ua));
});

app.get('/api/users', async (req, res) => {
    const users = await getAllUsers();

    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json({
        users: users.map(({ alias, name, team }) => [alias, name, team]),
    });
});

app.get('/api/config', async (req, res) => {
    const lotteryConfig = await getLotteryConfig();
    const users = await getAllUsers();

    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json({
        cfgData: lotteryConfig,
        leftUsers: users.map(({ alias, name, team }) => [alias, name, team]),
        luckyData: {},
    });
});

app.post('/admin/setUsers', async (req, res) => {
    console.log(req.body.teams);
    const teams = normalizeTeams(req.body.teams);
    const users = normalizeUsers(req.body.users, teams);
    console.log(teams);
    console.log(users);

    const result = await setAllUsers(users);
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json({ count: users.length });
});

app.post('/admin/clearUsersDB', async (req,  res) => {
    const result = await clearUsersDB();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
});

app.get('/admin/getAllUsers', async (req, res) => {
    const users = await getAllUsers();

    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    const teams = chain(users).groupBy('team').keys().value();

    return res.json({ users, teams });
});

app.post('/admin/clearRegisterDB', async (req, res) => {
    const result = await clearRegisterDB();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
});

app.get('/admin/getAllRegister', async (req, res) => {
    const result = await getAllRegister();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json(result);
});

// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});