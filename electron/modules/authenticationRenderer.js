const ipc = require("electron").ipcRenderer;

function initializeAuthentication() {
	let authenticateButton = document.getElementById("authenticate-button");

	authenticateButton.addEventListener("click", () => {
		let statusLabel = document.getElementById("status-label");
		let auth_info = {
			api_key: document.getElementById("api-public").value,
			api_secret: document.getElementById("api-secret").value,
			access_token: document.getElementById("access-public").value,
			access_secret: document.getElementById("access-secret").value,
		};

		ipc.on("advancedAuthentication", (event, data) => {
			if (data) {
				statusLabel.innerHTML = "Authenticated Successfully!";
				statusLabel.style.color = "#00FF00";
			} else {
				statusLabel.innerHTML = "Authentication failed";
				statusLabel.style.color = "#FF0000";
			}
		});

		ipc.send("advancedAuthentication", auth_info);
	});
}

initializeAuthentication();
