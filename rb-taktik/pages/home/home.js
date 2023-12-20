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
