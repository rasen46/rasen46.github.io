const hostName = document.getElementById("hostInput");
const password = document.getElementById("passwordInput");
const connectBtn = document.getElementById("connectButton");

const connectToServer = (host, pass) => {
    fetch(`${host}/ping`, {
        method: "GET",
        cache: "no-store"
    })
    .then(res => {
        if (!res.ok) throw new Error("Server unreachable");
        return false;
    })
    .then(() => {console.log("Server is alive"); attemptConnection(host, pass);})
    .catch(() => {
        alert("Server not reachable");
        return false;
    });
}

const attemptConnection = (host, pass) => {
    fetch(`${host}/connect`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({password: pass}),
        cache: "no-store"
    })
    .then(res => {
        if (!res.ok) throw new Error("Auth failed");
        return res.text();
    })
    .then(() => {
        console.log("Connected successfully");
    })
    .catch(() => {
        alert("Invalid password or server unreachable");
    });
}

connectBtn.addEventListener("click", () => {
    let host = hostName.value.trim();
    const pass = password.value;
    if (host === "") {
        alert("Please enter a host name");
        return;
    } else if (!host.startsWith("http://")) {
        host = "http://" + host;
    }

    connectToServer(host, pass);
});