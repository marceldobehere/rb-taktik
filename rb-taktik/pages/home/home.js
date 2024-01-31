function joinGame()
{
    goPage("/ingame")
}

function openOptions()
{
    goPage("/settings")
}

function joinRankedGame()
{
    joinGame();
}

function joinRandomGame()
{
    joinGame();
}


function createGame()
{
    joinGame();
}

function toggleDropDown(event) {
    let dropdownContent = document.getElementById("dropdown").querySelector(".dropdown-content");
    dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    event.stopPropagation();
}

function toggleNotifications(event) {
    let dropdownContent = document.getElementById("dropdown-notify").querySelector(".dropdown-notify-content");
    dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    event.stopPropagation();
}

function hideDropDown()
{
    let dropdownContent = document.getElementById("dropdown").querySelector(".dropdown-content");
    dropdownContent.style.display = "none";
}

async function doLogout()
{
    let result = await msgSendAndGetReply("logout", {"sessionId": sessionId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    setSessionId(null);
    goPage("/login")
}

function disableBtn(id)
{
    let btn = document.getElementById(id);
    btn.onclick = undefined;
    btn.className = "menu-tile menu-tile-disabled drop-shadow-figma";
}

async function homeInit()
{
    if (isGuest)
    {
        document.getElementById("info-username").textContent = "Guest";
        document.getElementById("info-rank").textContent = "None";
        document.getElementById("info-pfp").src = "/shared/images/guestPFP.png";

        document.getElementById("acc-login-logout").textContent = "Login";

        disableBtn("btn-ranked");
        disableBtn("btn-random");
        document.getElementById("friend-list-cont").style.display = "none";
    }
    else
    {
        document.getElementById("info-username").textContent = userData["username"];
        //document.getElementById("info-rank").textContent = userData["rank"];
        document.getElementById("info-pfp").src = "/shared/images/placeHolderPFP.png";

        document.getElementById("acc-login-logout").textContent = "Logout";
    }

    await loadFriendList();
}

async function loadFriendList()
{
    let friendListContainer = document.getElementById('actual-friend-list');
    friendListContainer.innerHTML = "";
    if (isGuest)
        return;

    let result = await msgSendAndGetReply("get-friends", {"sessionId": sessionId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    let friends = result["friends"];
    if (friends === undefined)
        return;

    for (let friendId of friends)
    {
        let result = await msgSendAndGetReply("get-user-info", {"userId":friendId});
        if (result["error"] != undefined)
        {
            alert("Error: " + result["error"]);
            return;
        }

        let friendDiv = document.createElement("div");
        friendDiv.className = "friend";
        friendListContainer.appendChild(friendDiv);

        let friendPfp = document.createElement("div");
        friendPfp.className = "friend_pfp";
        friendDiv.appendChild(friendPfp);

        let friendPfpImg = document.createElement("img");
        friendPfpImg.src = "/shared/images/placeHolderPFP.png";
        friendPfpImg.width = 50;
        friendPfpImg.height = 50;
        friendPfpImg.alt = "Profile Picture";
        friendPfp.appendChild(friendPfpImg);

        let friendUsername = document.createElement("div");
        friendUsername.className = "friend_username";
        friendDiv.appendChild(friendUsername);

        let friendUsernameSpan = document.createElement("span");
        friendUsernameSpan.textContent = result["username"];
        friendUsername.appendChild(friendUsernameSpan);

        let friendChallengeButton = document.createElement("div");
        friendChallengeButton.className = "challengeButton";
        friendDiv.appendChild(friendChallengeButton);

        let friendChallengeButtonBtn = document.createElement("button");
        friendChallengeButtonBtn.textContent = "Challenge";
        friendChallengeButtonBtn.onclick = () => {sendFriendChallenge(friendId)};
        friendChallengeButton.appendChild(friendChallengeButtonBtn);

    }
}

async function sendFriendChallenge(friendId)
{
    alert('<NOT IMPLEMENTED YET>');
}

onModulesImported.push(homeInit);