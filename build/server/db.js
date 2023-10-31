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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRegisterDB = exports.getAllRegister = exports.register = exports.getAllUsers = exports.clearUsersDB = exports.setAllUsers = void 0;
const level_1 = require("level");
const user_agent_1 = require("../shared/user-agent");
function read(db, key) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.get(key).catch(() => null);
    });
}
const usersDB = new level_1.Level('data/users', { valueEncoding: 'json' });
const registerDB = new level_1.Level('data/register', { valueEncoding: 'json' });
function safeExec(cb) {
    return cb().catch(err => 'UnknownError');
}
function setAllUsers(users) {
    return safeExec(() => __awaiter(this, void 0, void 0, function* () {
        yield usersDB.clear();
        yield usersDB.batch(users.map((user) => {
            const { alias } = user;
            return { type: 'put', key: alias, value: user };
        }));
    }));
}
exports.setAllUsers = setAllUsers;
function clearUsersDB() {
    return safeExec(() => usersDB.clear());
}
exports.clearUsersDB = clearUsersDB;
function getAllUsers() {
    return safeExec(() => usersDB.values().all());
}
exports.getAllUsers = getAllUsers;
function register(alias, deviceId, ua) {
    return safeExec(() => __awaiter(this, void 0, void 0, function* () {
        const user = yield read(usersDB, alias);
        if (!user)
            return 'InvalidUser';
        const app = (0, user_agent_1.detectBrowser)(ua);
        // if (app === 'Others') return 'InvalidBrowser';
        const key = `${deviceId}/${app}`;
        const previousAlias = yield read(registerDB, key);
        const previousUser = previousAlias === null ? null : (yield read(usersDB, alias));
        yield registerDB.put(key, alias);
        return { user, previousUser };
    }));
}
exports.register = register;
function getAllRegister() {
    return safeExec(() => __awaiter(this, void 0, void 0, function* () {
        const pairs = yield registerDB.iterator().all();
        return pairs.map(([key, alias]) => ({ key, alias }));
    }));
}
exports.getAllRegister = getAllRegister;
function clearRegisterDB() {
    return safeExec(() => registerDB.clear());
}
exports.clearRegisterDB = clearRegisterDB;
