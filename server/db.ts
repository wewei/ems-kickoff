import { Level } from "level";

const db = new Level<string, Record<string, string>>('data/lottery-register-index', { valueEncoding: 'json' });

export async function register(userId: string, deviceId: string, appId: string) {
    const data: Record<string, string> = await (db.get(deviceId)).catch(() => ({}));
    const oldUserId = data[appId] || '';
    data[appId] = userId;
    await db.put(deviceId, data);
    return Promise.resolve(oldUserId);
}
