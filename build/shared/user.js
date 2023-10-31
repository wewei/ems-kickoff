"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUsers = exports.normalizeTeams = void 0;
const lodash_1 = require("lodash");
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
exports.normalizeTeams = normalizeTeams;
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
exports.normalizeUsers = normalizeUsers;
