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
const lodash_1 = require("lodash");
function read(db, key) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.get(key).catch(() => null);
    });
}
const usersDB = new level_1.Level('data/users', { valueEncoding: 'json' });
const registerDB = new level_1.Level('data/register', { valueEncoding: 'json' });
function buildUserIndex(users) {
    return (0, lodash_1.chain)(users)
        .groupBy("alias")
        .mapValues(lodash_1.first)
        .value();
}
// Cache everything in usersDB
let userIndex = usersDB
    .values()
    .all()
    .then(buildUserIndex);
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
        userIndex = Promise.resolve(buildUserIndex(users));
    }));
}
exports.setAllUsers = setAllUsers;
function clearUsersDB() {
    return safeExec(() => {
        userIndex = Promise.resolve({});
        return usersDB.clear();
    });
}
exports.clearUsersDB = clearUsersDB;
function getAllUsers() {
    return safeExec(() => usersDB.values().all());
}
exports.getAllUsers = getAllUsers;
function register(alias, deviceId, ua) {
    return safeExec(() => __awaiter(this, void 0, void 0, function* () {
        const user = (yield userIndex)[alias];
        // const user = await read(usersDB, alias);
        if (!user)
            return 'InvalidUser';
        const app = (0, user_agent_1.detectBrowser)(ua);
        if ((0, user_agent_1.isBrowserUnsupported)(app))
            return 'InvalidBrowser';
        const key = `${deviceId}/${app}`;
        const previousAlias = yield read(registerDB, key);
        const previousUser = previousAlias === null ? null : ((yield userIndex)[previousAlias]);
        // const previousUser = previousAlias === null ? null : (await read(usersDB, previousAlias));
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
