document.addEventListener("DOMContentLoaded", function () {
    loadPlayers();
});

let players = [];
let lifetimeBans = [
    { name: "Najee Harris", date_added: "2024-12-01" },
];
let availableSports = new Set();
let activeSportFilter = null; // Keeps track of the active filter

function loadPlayers() {
    fetch("players.json")
        .then(response => response.json())
        .then(data => {
            players = data;
            extractSports(players);
            displaySportFilters();
            displayPlayers(players);
            displayTopOffenders(players);
            displayLifetimeBanList();
        });
}

function extractSports(playerList) {
    availableSports.clear();
    playerList.forEach(player => availableSports.add(player.sport));
}

function displaySportFilters() {
    const filterContainer = document.getElementById("sport-filters");
    filterContainer.innerHTML = "";

    availableSports.forEach(sport => {
        const button = document.createElement("button");
        button.innerText = sport;
        button.classList.toggle("active", activeSportFilter === sport);
        button.onclick = () => toggleSportFilter(sport, button);
        filterContainer.appendChild(button);
    });
}

function toggleSportFilter(sport, button) {
    if (activeSportFilter === sport) {
        activeSportFilter = null; // Remove filter
        displayPlayers(players); // Show all players
    } else {
        activeSportFilter = sport; // Set new filter
        displayPlayers(players.filter(player => player.sport === sport));
    }
    displaySportFilters(); // Update button states
}

function displayPlayers(playerList) {
    const tableBody = document.getElementById("player-table");
    tableBody.innerHTML = "";

    playerList.forEach(player => {
        const row = `<tr>
            <td>${player.name}</td>
            <td>${player.team}</td>
            <td>${player.reason}</td>
            <td>${player.date_added}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function searchPlayers() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(query));
    displayPlayers(filteredPlayers);
}

function displayTopOffenders(playerList) {
    const offenderCounts = {};
    
    playerList.forEach(player => {
        if (offenderCounts[player.name]) {
            offenderCounts[player.name] += 1;
        } else {
            offenderCounts[player.name] = 1;
        }
    });

    const sortedOffenders = Object.entries(offenderCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const tableBody = document.getElementById("top-offenders");
    tableBody.innerHTML = "";

    sortedOffenders.forEach(([name, count], index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${name}</td>
            <td>${count}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function displayLifetimeBanList() {
    const tableBody = document.getElementById("lifetime-ban");
    tableBody.innerHTML = "";

    lifetimeBans.forEach(player => {
        const row = `<tr>
            <td>${player.name}</td>
            <td>${player.date_added}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    // Add explanation text at the bottom
    document.getElementById("lifetime-ban-explanation").innerText = 
        "Players in the Lifetime Ban section have been permanently placed here due to repeated offenses or extreme cases.";
}

function sortTable(property) {
    players.sort((a, b) => (a[property] > b[property]) ? 1 : -1);
    displayPlayers(players);
}
