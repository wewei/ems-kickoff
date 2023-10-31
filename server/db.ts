import { Level } from "level";
import { readFile } from "fs/promises";
import { chain, first, isArray, isObject, isString } from "lodash";
import { resolve } from "app-root-path";
import { User } from "../shared/user";

function normalizeTeams(teams: any): string[] {
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

function normalizeUsers(users: any, teams: string[]): User[] {
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

const AllUsers = (async () => {
    const dataFilePath = resolve("data/users.json");
    const data = await readFile(dataFilePath, "utf-8")
        .then(JSON.parse)
        .catch(() => ({}));
    const teams = normalizeTeams(data.teams);
    const users = normalizeUsers(data.users, teams);
    const aliasIndex = chain(users).groupBy('alias').mapValues(first).value() as Record<string, User>;

    return { users, teams, aliasIndex };
})();

const db = new Level<string, Record<string, string>>('data/lottery-register-index', { valueEncoding: 'json' });

export async function register(alias: string, deviceId: string, appId: string): Promise<{ from: User | null, to: User}> {
    const { aliasIndex } = await AllUsers;

    if (!(alias in aliasIndex)) {
        throw new Error("Invalid user");
    }

    const data: Record<string, string> = await (db.get(deviceId)).catch(() => ({}));
    const previousAlias = data[appId];
    data[appId] = alias;
    await db.put(deviceId, data);

    return {
        from: (previousAlias && aliasIndex[previousAlias]) || null,
        to: aliasIndex[alias],
    };
}

export async function getAllUsers(): Promise<User[]> {
    const { users } = await AllUsers;

    return users;
}
