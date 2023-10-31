import { Level } from "level";
import { User } from "../shared/user";
import { detectBrowser } from "../shared/user-agent";

async function read<T>(db: Level<string, T>, key: string): Promise<T | null> {
    return db.get(key).catch(() => null);
}

const usersDB = new Level<string, User>('data/users', { valueEncoding: 'json' });
const registerDB = new Level<string, string>('data/register', { valueEncoding: 'json' });

export type UnknownError = 'UnknownError';

export type ExecResult<T, E = never> = Promise<T | E | UnknownError>

function safeExec<T>(cb: () => Promise<T>): ExecResult<T> {
    return cb().catch(err => 'UnknownError');
}

export function setAllUsers(users: User[]): ExecResult<void> {
    return safeExec(async () => {
        await usersDB.clear();

        await usersDB.batch(users.map((user) => {
            const { alias } = user;
            return { type: 'put', key: alias, value: user };
        }));

    });
}

export function clearUsersDB(): ExecResult<void> {
    return safeExec(() => usersDB.clear());
}

export function getAllUsers(): ExecResult<User[]> {
    return safeExec(() => usersDB.values().all());
}

export type RegisterResult = {
    user: User;
    previousUser: User | null;
};

export type RegisterError = 'InvalidUser' | 'InvalidBrowser';

export function register(alias: string, deviceId: string, ua: string): ExecResult<RegisterResult, RegisterError> {
    return safeExec(async () => {
        const user = await read(usersDB, alias);
        if (!user) return 'InvalidUser';

        const app = detectBrowser(ua);
        if (app === 'Others') return 'InvalidBrowser';

        const key = `${deviceId}/${app}`;
        const previousAlias = await read(registerDB, key);
        const previousUser = previousAlias === null ? null : (await read(usersDB, alias));

        await registerDB.put(key, alias);

        return { user, previousUser };
    });
}

export type GetAllRegisterResult = { key: string, alias: string }[]

export function getAllRegister(): ExecResult<GetAllRegisterResult> {
    return safeExec(async () => {
        const pairs = await registerDB.iterator().all();
        return pairs.map(([key, alias]) => ({ key, alias }));
    });
}

export function clearRegisterDB(): ExecResult<void> {
    return safeExec(() => registerDB.clear());
}
