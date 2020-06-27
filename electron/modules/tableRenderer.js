let ipc = require('electron').ipcRenderer

let followerTable = document.getElementById("follower-table")

function initializeTableSetup() {
    let tableLength = followerTable.rows.length;

    ipc.once("updateFollowerTable", (event, data) => {
        console.log(data);
        for (let follower of data) {
            let row = followerTable.insertRow(tableLength);
            let idRow = row.insertCell(0);
            let nameRow = row.insertCell(1);

            idRow.innerHTML = follower
            nameRow.innerHTML = "Name";
        }
    });
}

initializeTableSetup();