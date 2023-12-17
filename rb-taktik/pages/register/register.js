async function doRegister()
{
    let username = document.getElementById("input-username").value;
    if (username == "")
        return alert("Please enter a username");

    let password = document.getElementById("input-password").value;
    if (password == "")
        return alert("Please enter a password");

    let email = prompt("Enter mail");// TODO: ADD document.getElementById("input-email").value;
    if (email == "")
        return alert("Please enter an email");

    let result = await msgSendAndGetReply("register", {"username":username, "password":password, "email":email});
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