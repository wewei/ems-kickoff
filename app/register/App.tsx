import * as React from "react";
import { useLocalStorage, deleteFromStorage } from "@rehooks/local-storage";
import { User } from "../../shared/user";
import axios from "axios";
import Fingerprint from "@fingerprintjs/fingerprintjs";


const $deviceId = Fingerprint.load().then(fp => fp.get()).then(result => result.visitorId);

type RegisteredPanelProps = {
    user: User;
    onRollback: () => void;
};

function RegisteredPanel({ user, onRollback }: RegisteredPanelProps): JSX.Element {
    const { name, alias, team } = user;
    return (
        <div className="register-panel">
            <div className="top-filler" />
            <div className="title title-chs">您已注册为</div>
            <div className="title title-eng">{name} ({alias})</div>
            <div className="title title-eng">from {team}</div>
            <div className="mid-filler" />
            <div className="register-form">
                <button className="rollback-button" onClick={onRollback}>重新注册 (Rollback)</button>
            </div>
            <div className="bot-filler" />
        </div>
    );
}

type UnregisteredPanelProps = {
    onRegister: (user: User) => void;
};

function UnregisteredPanel({ onRegister }: UnregisteredPanelProps): JSX.Element {
    const [alias, setAlias] = React.useState("");

    const updateAlias = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setAlias(evt.target.value.trim());
    }, []);

    const submit = React.useCallback(async () => {
        const deviceId = await $deviceId;
        console.log(deviceId);
        axios.post('/api/register', { alias, deviceId }).then((res) => {
            const user: User = res.data.to;
            onRegister(user);
        });
    }, [alias]);

    return (
        <div className="register-panel">
            <div className="top-filler" />
            <div className="title title-chs">输入 Alias 参与抽奖</div>
            <div className="title title-eng">Submit your alias</div>
            <div className="mid-filler" />
            <div className="register-form">
                <input type="text" className="alias-input" value={alias} onChange={updateAlias}></input>
                <button className="submit-button" disabled={alias.trim().length === 0} onClick={submit} >注册 (Register)</button>
            </div>
            <div className="bot-filler" />
        </div>
    );
}

const LOCAL_STORAGE_KEY = 'registered-user';

export default function App(): JSX.Element {
    const [user, setUser] = useLocalStorage<User>(LOCAL_STORAGE_KEY);
    const rollback = React.useCallback(() => {
        deleteFromStorage(LOCAL_STORAGE_KEY);
    }, []);
    const confirmRegistered = React.useCallback((user: User) => {
        console.log(user);
        setUser(user);
    }, []);

    return (
        <div className="app">
            {
                user
                    ? <RegisteredPanel user={user} onRollback={rollback} />
                    : <UnregisteredPanel onRegister={confirmRegistered} />
            }
        </div>
    );
}

