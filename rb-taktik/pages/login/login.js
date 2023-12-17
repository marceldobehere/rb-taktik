async function doLogin()
{
    let username = document.getElementById("input-username").value;
    if (username == "")
        return alert("Please enter a username");

    let password = document.getElementById("input-password").value;
    if (password == "")
        return alert("Please enter a password");

    let result = await msgSendAndGetReply("login", {"username":username, "password":password});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    console.log(result);
    console.log(result["sessionId"]);
    setSessionId(result["sessionId"]);
    goPage("/home")
}

function initLogin()
{
    console.log("> Initializing login page");
    console.log("  > Session id:", sessionId);
    if (sessionId != undefined)
        goPage("/home");
}

onModulesImported.push(initLogin);