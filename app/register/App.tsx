import * as React from "react";
import { useLocalStorage, deleteFromStorage } from "@rehooks/local-storage";
import { User } from "../../shared/user";
import axios from "axios";
import Fingerprint from "@fingerprintjs/fingerprintjs";


const $deviceId = Fingerprint.load().then(fp => fp.get()).then(result => result.visitorId);

type RegisteredPanelProps = {
    user: User;
    onReset: () => void;
};

function RegisteredPanel({ user, onReset }: RegisteredPanelProps): JSX.Element {
    const { name, alias, team } = user;
    return (
        <div className="register-panel">
            <div className="top-filler" />
            <div className="title title-chs">您已注册为</div>
            <div className="title title-eng">{name} ({alias})</div>
            <div className="title title-eng">from {team}</div>
            <div className="mid-filler" />
            <div className="register-form">
                <button className="rollback-button" onClick={onReset}>重新注册 (Reset)</button>
            </div>
            <div className="bot-filler" />
        </div>
    );
}

type UnregisteredPanelProps = {
    onRegister: (user: User) => void;
    onInvalidAlias: (alias: string) => void;
};

function UnregisteredPanel({ onRegister, onInvalidAlias }: UnregisteredPanelProps): JSX.Element {
    const [alias, setAlias] = React.useState("");

    const updateAlias = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setAlias(evt.target.value.trim());
    }, []);

    const submit = React.useCallback(async () => {
        const deviceId = await $deviceId;
        axios.post('/api/register', { alias, deviceId }).then((res) => {
            const user: User = res.data.user;
            onRegister(user);
        }).catch((err) => {
            if (err.response.data.error === 'InvalidUser') {
                onInvalidAlias(alias);
            }
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

type InvalidAliasPanelProps = {
    alias: string;
    onReset: () => void;
};

function InvalidAliasPanel({ alias, onReset }: InvalidAliasPanelProps): JSX.Element {
    return (
        <div className="register-panel">
            <div className="top-filler" />
            <div className="title title-chs">"{alias}" 不在与会名单中</div>
            <div className="title title-eng">The alias is not in the attendee list, please check the spell</div>
            <div className="mid-filler" />
            <div className="register-form">
                <button className="rollback-button" onClick={onReset}>重新注册 (Reset)</button>
            </div>
            <div className="bot-filler" />
        </div>
    )
}

const LOCAL_STORAGE_KEY = 'registered-user';

export default function App(): JSX.Element {
    const [user, setUser] = useLocalStorage<User>(LOCAL_STORAGE_KEY);
    const [invalidAlias, setInvalidAlias] = React.useState("");
    const reset = React.useCallback(() => {
        deleteFromStorage(LOCAL_STORAGE_KEY);
        setInvalidAlias("");
    }, []);
    const confirmRegistered = React.useCallback((user: User) => {
        setUser(user);
    }, []);
    const onInvalidAlias = React.useCallback((alias: string) => {
        setInvalidAlias(alias);
    }, []);

    return (
        <div className="app">
            {user ? (
                <RegisteredPanel user={user} onReset={reset} />
            ) : invalidAlias ? (
                <InvalidAliasPanel alias={invalidAlias} onReset={reset} />
            ) : (
                <UnregisteredPanel
                    onRegister={confirmRegistered}
                    onInvalidAlias={onInvalidAlias}
                />
            )}
        </div>
    );
}

