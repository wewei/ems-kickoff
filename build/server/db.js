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
exports.getAllUsers = exports.register = void 0;
const level_1 = require("level");
const promises_1 = require("fs/promises");
const lodash_1 = require("lodash");
const app_root_path_1 = require("app-root-path");
function normalizeTeams(teams) {
    if (!(0, lodash_1.isArray)(teams)) {
        console.error("Team list is not an Array");
        return [];
    }
    return teams.reduce((memo, team, idx) => {
        if (!(0, lodash_1.isString)(team)) {
            console.error(`Invalid team name at #[${idx}]`);
        }
        else {
            memo.push(team);
        }
        return memo;
    }, []);
}
function normalizeUsers(users, teams) {
    if (!(0, lodash_1.isArray)(users)) {
        console.error("User list is not an Array");
        return [];
    }
    return users.reduce((memo, user, idx) => {
        if (!(0, lodash_1.isObject)(user)) {
            console.error(`User info at #[${idx}] is not an Object`);
        }
        else {
            const { name, alias, team } = user;
            if (!(0, lodash_1.isString)(name)) {
                console.error(`Invalid #name at #[${idx}]`);
            }
            else if (!(0, lodash_1.isString)(alias)) {
                console.error(`Invalid #alias at #[${idx}]`);
            }
            else if (!(0, lodash_1.isString)(team)) {
                console.error(`Invalid #team at #[${idx}]`);
            }
            memo.push(user);
        }
        return memo;
    }, []);
}
const AllUsers = (() => __awaiter(void 0, void 0, void 0, function* () {
    const dataFilePath = (0, app_root_path_1.resolve)("data/users.json");
    const data = yield (0, promises_1.readFile)(dataFilePath, "utf-8")
        .then(JSON.parse)
        .catch(() => ({}));
    const teams = normalizeTeams(data.teams);
    const users = normalizeUsers(data.users, teams);
    const aliasIndex = (0, lodash_1.chain)(users).groupBy('alias').mapValues(lodash_1.first).value();
    return { users, teams, aliasIndex };
}))();
const db = new level_1.Level('data/lottery-register-index', { valueEncoding: 'json' });
function register(alias, deviceId, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { aliasIndex } = yield AllUsers;
        if (!(alias in aliasIndex)) {
            throw new Error("Invalid user");
        }
        const data = yield (db.get(deviceId)).catch(() => ({}));
        const previousAlias = data[appId];
        data[appId] = alias;
        yield db.put(deviceId, data);
        return {
            from: (previousAlias && aliasIndex[previousAlias]) || null,
            to: aliasIndex[alias],
        };
    });
}
exports.register = register;
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const { users } = yield AllUsers;
        return users;
    });
}
exports.getAllUsers = getAllUsers;
