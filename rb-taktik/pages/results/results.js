async function initResultsPage()
{
    let params = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log(params);

    const playerNumber = parseInt(params["playerNumber"] || "-1");
    const playerNames = JSON.parse(params["playerNames"] || "[\"N/A\", \"N/A\"]");
    const playerPoints = JSON.parse(params["playerPoints"] || "[0,0]");
    const winner = parseInt(params["winner"] || "-1");
    let oldRank = parseInt(params["oldRank"] || "-1");
    let newRank = parseInt(params["newRank"] || "-1");
    const isValid = playerNumber !== -1;

    console.log("Player number:", playerNumber);
    console.log("Player names:", playerNames);
    console.log("Player points:", playerPoints);
    console.log("Winner:", winner);
    console.log("Old rank:", oldRank);
    console.log("New rank:", newRank);
    console.log("Is valid:", isValid);

    if (!isValid)
        return alert("Invalid results data");

    // For Testing
    oldRank += 0;
    newRank += 0;

    document.getElementById("player-name").textContent = playerNames[winner];
    document.getElementById("rounds-played").textContent = playerPoints[0] + playerPoints[1];
    document.getElementById("rounds-won").textContent = playerPoints[winner];
    document.getElementById("rank-old").textContent = newRank;

    if (newRank > oldRank)
        document.getElementById("points-gained").textContent = " (+" + (newRank - oldRank) + ")";
    else if (newRank < oldRank)
        document.getElementById("points-gained").textContent = " (" + (newRank - oldRank) + ")";
    else
        document.getElementById("points-gained").style.display = "none";

    let rankImageOld = document.getElementById("rank-image-old");
    let rankArrowImage = document.getElementById("rank-arrow-image");
    let rankImageNew = document.getElementById("rank-image-new");
    let rankImageContainer = document.getElementById("rank-image-container");
    let eloPointsContainer = document.getElementById("elo-points-container");
    let homeButton = document.getElementById("home-button");
    rankImageOld.src = getRankImageFromLevel(oldRank);
    rankImageNew.src = getRankImageFromLevel(newRank);

    if (rankImageOld.src === rankImageNew.src)
    {
        rankArrowImage.style.display = "none";
        rankImageNew.style.display = "none";
        rankImageContainer.style.gridTemplateColumns = "1fr";
    }

    if (isGuest)
    {
        rankImageContainer.innerHTML="";
        eloPointsContainer.innerHTML="&nbsp;";

    }
}

onModulesImported.push(initResultsPage);