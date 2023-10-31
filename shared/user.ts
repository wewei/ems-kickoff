import { isArray, isString, isObject } from "lodash";

export type User = {
    name: string;
    alias: string;
    team: string;
};

export function normalizeTeams(teams: any): string[] {
    if (!isArray(teams)) {
        console.error("Team list is not an Array");
        return [];
    }
    return teams.reduce((memo, team, idx) => {
        if (!isString(team)) {
            console.error(`Invalid team name at #[${idx}]`);
        } else {
            memo.push(team);
        }
        return memo;
    }, []);
}

export function normalizeUsers(users: any, teams: string[]): User[] {
    if (!isArray(users)) {
        console.error("User list is not an Array");
        return [];
    }
    return users.reduce((memo, user, idx) => {
        if (!isObject(user)) {
            console.error(`User info at #[${idx}] is not an Object`);
        } else {
            const { name, alias, team } = user as User;
            if (!isString(name)) {
                console.error(`Invalid #name at #[${idx}]`);
            } else if (!isString(alias)) {
                console.error(`Invalid #alias at #[${idx}]`);
            } else if (!isString(team)) {
                console.error(`Invalid #team at #[${idx}]`);
            }
            memo.push(user);
        }
        return memo;
    }, []);
}
