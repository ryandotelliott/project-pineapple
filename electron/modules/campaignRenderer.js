const ipc = require("electron").ipcRenderer;
const { Sortable } = require("@shopify/draggable");

const priorityList = document.getElementById("priority-list"); // DOM priority-list ID
const campaignModalButton = document.getElementById("campaign-modal-button"); // Button to open new modal

campaignModalButton.addEventListener("click", () => {
	const modal = document.getElementById("new-campaign-modal");
	const backgroundOverlay = document.getElementById("fade-background");
	modal.style.display = "flex";
	backgroundOverlay.style.display = "block";
});

// TODO: Do this shit only when modal is opened

const sortable = new Sortable(document.querySelectorAll("ul"), {
	draggable: "li",
});

let sortedPriorities = [];

sortable.on("drag:stop", (sortableEvent) => {
	sortedPriorities = [];

	setTimeout(() => {
		for (let child of priorityList.children) {
			sortedPriorities.push(child.getAttribute("data-id"));
			sortableEvent.data.originalSource.style.display = "block";
		}
	}, 0);
});
