const plrTextInp = document.getElementById("plrTextInput");
const playerChatLog = document.getElementById("playerChat");
const canvas = document.getElementById("canvas");

const toolbox = document.getElementById("toolbox");
const penBtn = document.getElementById("pencilTool");
const eraserBtn = document.getElementById("eraserTool");
const colorPicker = document.getElementById("colorPicker");
const sizePicker = document.getElementById("sizePicker");

const httpConnection = window.serverHTTP;
const url = new URL(httpConnection);
url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
url.port = String(Number(url.port) + 1);

const ws = new WebSocket(url.toString());

const ctx = canvas.getContext("2d");

const chatLog = [];

let isDrawing = false,
	allowDrawing = true,
	insideCanvas = false,
	lastX = 0,
	lastY = 0,
	lastSend = 0,
	currentTool = "pen";

function pushChatMessage(username, message) {
	chatLog.push(`<${username}> ${message}`);
}

function getCookie(name) {
	return document.cookie
		.split("; ")
		.find(row => row.startsWith(name + "="))
		?.split("=")[1];
}

plrTextInp.addEventListener("keydown", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		const message = plrTextInp.value.trim();
		if (message === "") return;

		pushChatMessage(window.plrUsername, message);
		plrTextInp.value = "";

		updateChat();

		ws.send(JSON.stringify({
			type: "chat",
			message: message
		}));
	}
});

function updateChat() {
	playerChatLog.innerHTML = "";
	chatLog.forEach(msg => {
		const msgDiv = document.createElement("div");
		msgDiv.textContent = msg;
		playerChatLog.appendChild(msgDiv);
	});
}

const startDrawing = (event) => {
	if (!allowDrawing) return;

	isDrawing = true;
	lastX = event.offsetX;
	lastY = event.offsetY;

	ctx.lineWidth = sizePicker.value;
	ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : colorPicker.value;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

const draw = (event) => {
    if (!isDrawing) return;

    const x = event.offsetX;
    const y = event.offsetY;

    // draw locally
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // send to server
    const points = [{x: lastX, y: lastY}, {x: x, y: y}]; // simple two-point
    ws.send(JSON.stringify({
        type: "draw",
        points: points,
        color: currentTool === "eraser" ? "#ffffff" : colorPicker.value,
        size: sizePicker.value,
        tool: currentTool
    }));
    lastX = x;
    lastY = y;
};

function applyStrokeStyle(ctx, data) {
	ctx.setLineDash([]);
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.lineWidth = data.size;
	ctx.strokeStyle = data.tool === "eraser" ? "#ffffff" : data.color;
	ctx.globalAlpha = 1;
}

function drawRemoteStroke(data) {
    applyStrokeStyle(ctx, data);

    ctx.beginPath();
    const pts = data.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
    }
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

penBtn.addEventListener("click", function() {
	currentTool = "pen";
	toolbox.querySelectorAll(".toolButton").forEach(t => t.classList.remove("activeTool"));
	penBtn.classList.add("activeTool");
});

eraserBtn.addEventListener("click", function() {
	currentTool = "eraser";
	toolbox.querySelectorAll(".toolButton").forEach(t => t.classList.remove("activeTool"));
	eraserBtn.classList.add("activeTool");
});

ws.onopen = () => {
	ws.send(JSON.stringify({
		type: "join",
		username: window.plrUsername,
		uuid: getCookie("client_uuid"),
		password: window.serverPassword
	}));
};

ws.onmessage = (event) => {
	let data;
	try {
		data = JSON.parse(event.data);
	} catch {
		return;
	}

	console.log(data);

	switch (data.type) {
		case "join_success":
			console.log("Authenticated");
			break;

		case "error":
			alert(data.message);
			ws.close();
			break;

		case "chat":
			pushChatMessage(data.username, data.message);
			updateChat();
			break;

		case "draw":
			drawRemoteStroke(data);
			break;

		case "player_left":
			handlePlayerLeave(data.uuid);
			break;
	}
};

//window.addEventListener("resize", updateSize);
updateSize();