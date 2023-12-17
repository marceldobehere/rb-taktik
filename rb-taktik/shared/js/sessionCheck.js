var sessionId = null;
var isGuest = true;

function setSessionId(newSessionId)
{
    localStorage.setItem("sessionId", JSON.stringify(newSessionId));
    sessionId = newSessionId;
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
        let result = await msgSendAndGetReply("get-user", {"sessionId":sessionId});
        if (result["error"] != undefined)
        {
            isGuest = true;
            console.log("Error: ", result["error"]);
            setSessionId(null);
            return;
        }

        isGuest = false;
        console.log("  > Logged in as " + result["username"] + " (" + result["userId"] + ")");
        //setSessionId(sessionId);
    }
}

onModulesImported.push(initSessionCheck);