const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const helper = require("./modules/api");
const fs = require("fs");
const { resolve } = require("path");

let window;

async function createWindow() {
	if (process.platform === "win32") {
		window = new BrowserWindow({
			transparent: true,
			frame: false,
			resizable: false,
			fullscreenable: false,
			center: true,
			width: 400,
			height: 500,
			webPreferences: {
				nodeIntegration: true,
			},
		});
	} else {
		// If not on windows, keep the default frame (OS x).
		window = new BrowserWindow({
			transparent: true,
			frame: true,
			resizable: false,
			fullscreenable: false,
			center: true,
			width: 400,
			height: 500,
			webPreferences: {
				nodeIntegration: true,
			},
		});
	}

	await window.loadFile("views/advanced_auth.html");

	try {
		loadConfig(); // Load the config and try to authenticate with it
	} catch (err) {
		if (err.message == "FileNotFound") console.log("File not found. Waiting for user input.");
		else console.log(err);
	}
}

app.whenReady().then(createWindow);

// Listen for the user to click the authenticate button
ipc.on("advancedAuthentication", async (event, data) => {
	authenticate(data);
});

async function authenticate(tokens) {
	console.log("Authenticating...");
	try {
		await helper.authenticateSignIn(tokens);
		if (!fs.existsSync("./config.json")) {
			try {
				fs.promises.writeFile("./config.json", JSON.stringify(tokens));
			} catch (err) {
				console.log("Error writing to config file.");
			}
		}

		await window.loadFile("views/campaigns.html");
		window.setSize(1300, 750);
		window.center();
	} catch (err) {
		console.log(err);
	}
}

function loadConfig() {
	if (!fs.existsSync("./config.json")) throw new Error("FileNotFound");
	fs.readFile("./config.json", "utf-8", (err, data) => {
		console.log(JSON.parse(data));
		if (err) throw err;
		authenticate(JSON.parse(data));
	});
}
