"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express in typescript file
const express_1 = __importDefault(require("express"));
const app_root_path_1 = require("app-root-path");
const db_1 = require("./db");
const body_parser_1 = __importDefault(require("body-parser"));
const lottery_config_1 = require("./lottery-config");
const user_1 = require("../shared/user");
const lodash_1 = require("lodash");
// Initialize the express engine
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "1mb" }));
app.use(express_1.default.static((0, app_root_path_1.resolve)("dist")));
// Take a port 3000 for running server.
const port = Number.parseInt(process.env.PORT || "3000");
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express.");
});
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { alias, deviceId } = req.body;
    const ua = req.get('User-Agent') || "Unknown UA";
    console.log(`[API] Registering with alias: ${alias}, deviceId: ${deviceId}, ua: ${ua}`);
    return res.json(yield (0, db_1.register)(alias, deviceId, ua));
}));
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, db_1.getAllUsers)();
    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({
        users: users.map(({ alias, name, team }) => [alias, name, team]),
    });
}));
app.get('/api/config', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lotteryConfig = yield (0, lottery_config_1.getLotteryConfig)();
    const users = yield (0, db_1.getAllUsers)();
    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({
        cfgData: lotteryConfig,
        leftUsers: users.map(({ alias, name, team }) => [alias, name, team]),
        luckyData: {},
    });
}));
app.post('/admin/setUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.teams);
    const teams = (0, user_1.normalizeTeams)(req.body.teams);
    const users = (0, user_1.normalizeUsers)(req.body.users, teams);
    console.log(teams);
    console.log(users);
    const result = yield (0, db_1.setAllUsers)(users);
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({ count: users.length });
}));
app.post('/admin/clearUsersDB', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.clearUsersDB)();
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
}));
app.get('/admin/getAllUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, db_1.getAllUsers)();
    if (users === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    const teams = (0, lodash_1.chain)(users).groupBy('team').keys().value();
    return res.json({ users, teams });
}));
app.post('/admin/clearRegisterDB', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.clearRegisterDB)();
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json({});
}));
app.get('/admin/getAllRegister', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.getAllRegister)();
    if (result === 'UnknownError') {
        return res.status(500).json({ error: 'UnknownError' });
    }
    return res.json(result);
}));
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});
