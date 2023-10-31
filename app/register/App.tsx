import * as React from "react";

export default function App(): JSX.Element {
    return (
        <div className="app">
            <div className="register-panel">
                <div className="top-filler" />
                <div className="title title-chs">输入 Alias 参与抽奖</div>
                <div className="title title-eng">Submit your alias</div>
                <div className="mid-filler" />
                <div className="register-form">
                    <input type="text" className="alias-input"></input>
                    <button className="submit-button">Submit</button>
                </div>
                <div className="bot-filler" />
            </div>
        </div>
    );
}

