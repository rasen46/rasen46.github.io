const plrTextInp = document.getElementById("plrTextInput");
const playerChatLog = document.getElementById("playerChat");

const chatLog = [];

plrTextInp.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const message = plrTextInp.value.trim();
        if (message === "") return;

        chatLog.push(message);
        plrTextInp.value = "";

        updateChat();
    }
});

function updateChat() {
    playerChatLog.innerHTML = "";
    chatLog.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = "<player> "+msg;
        playerChatLog.appendChild(msgDiv);
    });
}