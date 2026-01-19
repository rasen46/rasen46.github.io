const username = document.getElementById("usernameInput");
const hostName = document.getElementById("hostInput");
const password = document.getElementById("passwordInput");
const connectBtn = document.getElementById("connectButton");

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) +
    "; expires=" + expires +
    "; path=/" +
    "; SameSite=Lax";
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

const getUUID = () => {
    const sc = getCookie("client_uuid");
    if (sc) return sc;
    const newUUID = crypto.randomUUID();
    setCookie("client_uuid", newUUID, 365);
    return newUUID;
}

const connectToServer = (host) => {
    fetch(`${host}/ping`, {
        method: "GET",
        cache: "no-store"
    })
    .then(res => {
        if (!res.ok) throw new Error("Server unreachable");
        return false;
    })
    .then(() => {console.log("Server is alive"); attemptConnection(host, getUUID());})
    .catch(() => {
        alert("Server not reachable");
        return false;
    });
}

const attemptConnection = (host, uuid) => {
    fetch(`${host}/connect`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({password: password.value.trim(), client_uuid: undefined, username: username.value.trim()}),
        cache: "no-store"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res;
    })
    .then(() => {
        console.log("Connected successfully");
    })
    .catch((res) => {
        alert(res);
    });
}

connectBtn.addEventListener("click", () => {
    let host = hostName.value.trim();
    if (host === "") {
        alert("Please enter a host name");
        return;
    } else if (!host.startsWith("http://") && !host.startsWith("https://")) {
        host = "http://" + host;
    }

    connectToServer(host);
});