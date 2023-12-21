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

async function homeInit()
{
    if (isGuest)
    {
        document.getElementById("info-username").textContent = "Guest";
        document.getElementById("info-rank").textContent = "None";
        document.getElementById("info-pfp").src = "/shared/images/guestPFP.png";

        document.getElementById("acc-login-logout").textContent = "Login";
    }
    else
    {
        document.getElementById("info-username").textContent = userData["username"];
        //document.getElementById("info-rank").textContent = userData["rank"];
        document.getElementById("info-pfp").src = "/shared/images/placeHolderPFP.png";

        document.getElementById("acc-login-logout").textContent = "Logout";
    }
}

onModulesImported.push(homeInit);