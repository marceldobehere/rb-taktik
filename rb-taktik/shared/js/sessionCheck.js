var sessionId = null;
var isGuest = true;
var userData = {};

function setSessionId(newSessionId)
{
    localStorage.setItem("sessionId", JSON.stringify(newSessionId));
    sessionId = newSessionId;
}

async function refreshUserData()
{
    let result = await msgSendAndGetReply("get-user", {"sessionId":sessionId});
    if (result["error"] != undefined)
    {
        isGuest = true;
        console.log("Error: ", result["error"]);
        setSessionId(null);
        return result;
    }

    userData = result;
    if (userData["rank"] < 600)
        userData["rank"] = 600;
    isGuest = false;
    return result;
}

async function initSessionCheck()
{
    console.log("> Checking session...");
    sessionId = null;
    try
    {
        let idStr = localStorage.getItem("sessionId");
        if (idStr != null && idStr != undefined)
            sessionId = JSON.parse(idStr);
    }
    catch (e)
    {
        console.log("  > Error parsing sessionId: ", e);
    }

    if (sessionId == null || sessionId == undefined)
    {
        isGuest = true;
        console.log("  > Not logged in");
        setSessionId(null);
    }
    else
    {
        let result = await refreshUserData();
        console.log("  > Logged in as " + result["username"] + " (" + result["userId"] + ")");
        //setSessionId(sessionId);
    }
}

onModulesImported.push(initSessionCheck);