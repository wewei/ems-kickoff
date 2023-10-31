import axios from "axios";
import * as React from "react";

function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
    } catch {
        return false;
    }
    return true;
}

export default function App(): JSX.Element {
    const ref = React.useRef<HTMLTextAreaElement>(null);
    const readFile = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const files = evt.target.files;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (ref.current) {
                    ref.current.value = text as string;
                }
            }
            reader.readAsText(files[0]);
        }
    }, [ref]);

    const uploadUserDB = React.useCallback(() => {
        const content = ref.current?.value || "";
        try {
            const data = JSON.parse(content);
            axios.post("/admin/setUsers", data).then((res) => {
                alert(`Upload ${res.data.count} items`);
            }, (err) => {
                console.log(err);
                alert("Upload failed");
            });
        } catch {
            alert("Invalid JSON");
        }
    }, [ref]);

    const clearUserDB = React.useCallback(() => {
        axios.post("/admin/clearUsersDB", {}).then((res) => {
            alert("Clear user DB success");
        }, (err) => {
            console.log(err);
            alert("Clear user DB failed");
        });
    }, []);

    const clearRegisterDB = React.useCallback(() => {
        axios.post("/admin/clearRegisterDB", {}).then((res) => {
            alert("Clear register DB success");
        }, (err) => {
            console.log(err);
            alert("Clear register DB failed");
        });
    }, []);

    const downloadUserDB = React.useCallback(() => {
        axios.get("/admin/getAllUsers").then((res) => {
            if (ref.current) {
                ref.current.value = JSON.stringify(res.data, null, 2);
            }
        });
    }, [ref]);

    const downloadRegisterDB = React.useCallback(() => {
        axios.get("/admin/getAllRegister").then((res) => {
            if (ref.current) {
                ref.current.value = JSON.stringify(res.data, null, 2);
            }
        });
    }, [ref]);

    return (
        <div>
            <div>
                <button onClick={clearUserDB}>Clear User DB</button>
                <button onClick={clearRegisterDB}>Clear Register DB</button>
            </div>
            <div>
                <input type="file" onChange={readFile}></input>
                <button onClick={uploadUserDB}>Upload User DB</button>
                <button onClick={downloadUserDB}>Download User DB</button>
                <button onClick={downloadRegisterDB}>Download Register DB</button>
                <div><textarea ref={ref} style={{ width: "100%", height: "500px", resize: "vertical" }} ></textarea></div>
            </div>

        </div>
    );
}