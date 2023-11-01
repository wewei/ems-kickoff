import * as React from "react";
import { useLocalStorage, deleteFromStorage } from "@rehooks/local-storage";
import axios from "axios";
import Fingerprint from "@fingerprintjs/fingerprintjs";
import { User } from "../../shared/user";
import { detectBrowser, isBrowserUnsupported } from "../../shared/user-agent";

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
            <div className="title l1-title">您已注册为</div>
            <div className="title l2-title">{name} ({alias})</div>
            <div className="title l2-title">from {team}</div>
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
        // if (browser === 'BingApp' || browser === 'StartApp') {
        //     alert(`Alias: ${alias}, DeviceId: ${deviceId}`);
        // }
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
            <div className="title l1-title">输入 Alias 参与抽奖</div>
            <div className="title l2-title">Submit your alias</div>
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
            <div className="title l1-title">"{alias}" 不在与会名单中</div>
            <div className="title l2-title">The alias is not in the attendee list, please check the spell</div>
            <div className="mid-filler" />
            <div className="register-form">
                <button className="rollback-button" onClick={onReset}>重新注册 (Reset)</button>
            </div>
            <div className="bot-filler" />
        </div>
    );
}

type InvalidBrowserPanelProps = {
};

function InvalidBrowserPanel({ }: InvalidBrowserPanelProps): JSX.Element {
    return (
        <div className="register-panel">
            <div className="top-filler" />
            <div className="title l1-title">请在 Edge (mobile), Bing 或 Start 中打开此页面</div>
            <div className="title l2-title">Please open the page with Edge (mobile), Bing or Start</div>
            <div className="mid-filler" />
            <div className="title">
                <a href="https://app.adjust.com/vehqu7h_ueso5h4" className="download-link">Download Edge</a>
                <a href="https://app.adjust.com/15oc1rs0_15c4jyw8" className="download-link">Download Bing</a>
                <a href="https://app.adjust.com/15h0mmeu_15pao2f" className="download-link">Download Start</a>
            </div>
            <div className="bot-filler" />
        </div>
    );
}

const LOCAL_STORAGE_KEY = 'registered-user';
const browser = detectBrowser(navigator.userAgent);
const isUnsupported = isBrowserUnsupported(browser);

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
            {/* <div style={{ position: "fixed"}}>UA: {navigator.userAgent}</div> */}
            {
            isUnsupported ? (
                <InvalidBrowserPanel />
            ) : user ? (
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

