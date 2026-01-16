const plrTextInp = document.getElementById("plrTextInput");
const playerChatLog = document.getElementById("playerChat");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const chatLog = [];

let isDrawing = false, insideCanvas = false;

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

const startDrawing = (event) => {
    isDrawing = true;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

const draw = (event) => {
    if (!isDrawing) return;

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

const updateSize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseenter", (event) => {
    if (event.buttons === 1) {
        startDrawing(event);
    }
});

canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);

window.addEventListener("resize", updateSize);
updateSize();