// Import the express in typescript file
import express from 'express';
import { resolve } from "app-root-path";
import { clearRegisterDB, clearUsersDB, getAllRegister, getAllUsers, register, setAllUsers } from './db';
import bodyParser from 'body-parser'; 
import { getLotteryConfig } from './lottery-config';
import { normalizeTeams, normalizeUsers } from '../shared/user';
import { chain, isArray, size } from 'lodash';

const DEFAULT_WEIGHT = 0.0001;
let eclipse = new Set();

// Initialize the express engine
const app: express.Application = express();

app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.static(resolve("dist")));
 
// Take a port 3000 for running server.
const port: number = Number.parseInt(process.env.PORT || "3000");
 
// Handling '/' Request
app.get('/', (req, res) => {
    res.redirect('/register');
});

app.post('/api/register', async (req, res) => {
    const { alias, deviceId } = req.body as { alias: string; deviceId: string };
    const ua = req.get('User-Agent') || "Unknown UA";

    console.log(`[API] Registering with alias: ${alias}, deviceId: ${deviceId}, ua: ${ua}`);

    const result = await register(alias.toLowerCase(), deviceId, ua);

    if (result === 'InvalidBrowser') { 
        return res.status(403).json({ error: result });
    }

    if (result === 'InvalidUser') {
        return res.status(404).json({ error: result });
    }

    if (result === 'UnknownError') {
        return res.status(500).json({ error: result });
    }

    return res.json(result);
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
    const cfgData = await getLotteryConfig();
    const users = await getAllUsers();

    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    const regs = await getAllRegister();

    if (regs === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    const weight = chain(regs)
        .groupBy("alias")
        .mapValues(size)
        .mapValues((s) => (
            s > 3 ? 8 :
            s > 2 ? 4 :
            s > 1 ? 2 :
            s > 0 ? 1 : 0
        ))
        .value();

    const leftUsers = users.map(({ alias, name, team }) => [
        alias,
        name,
        team,
        eclipse.has(alias) ? 0 : weight[alias] || DEFAULT_WEIGHT,
    ]);

    return res.json({ cfgData, leftUsers, luckyData: {} });
});

app.post('/api/admin/setUsers', async (req, res) => {
    const teams = normalizeTeams(req.body.teams);
    const users = normalizeUsers(req.body.users, teams);

    const result = await setAllUsers(users);
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json({ count: users.length });
});

app.post('/api/admin/clearUsersDB', async (req,  res) => {
    const result = await clearUsersDB();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
});

app.get('/api/admin/getAllUsers', async (req, res) => {
    const users = await getAllUsers();

    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    const teams = chain(users).groupBy('team').keys().value();

    return res.json({ users, teams });
});

app.post('/api/admin/clearRegisterDB', async (req, res) => {
    const result = await clearRegisterDB();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
});

app.get('/api/admin/getAllRegister', async (req, res) => {
    const result = await getAllRegister();

    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }

    return res.json(result);
});

app.get('/api/admin/getEclipse', (req, res) => {
    return res.json(Array.from(eclipse));
});

app.post('/api/admin/setEclipse', (req, res) => {
    const aliasList = isArray(req.body) ? req.body : [];
    eclipse = new Set(aliasList);
    return res.json({ count: eclipse.size });
});

// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});