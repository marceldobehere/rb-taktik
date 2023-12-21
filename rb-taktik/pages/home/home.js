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

function toggleDropDown() {
    var dropdownContent = document.getElementById("dropdown").querySelector(".dropdown-content");
    dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";
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



