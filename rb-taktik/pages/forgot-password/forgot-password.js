let errorUsername = document.getElementById("error-username");
let errorEmail = document.getElementById("error-email");

function clearErrors()
{
    errorUsername.textContent = "";
    errorEmail.textContent = "";

}
clearErrors();

async function submitClick()
{
    clearErrors();

    let username = document.getElementById("input-username").value;
    console.log("Username", username);
    if (username == "")
        return errorUsername.textContent = "Please enter your username";
    errorUsername.textContent = "";

    let email = document.getElementById("input-email").value;
    console.log("Email", email);
    if (email == "")
        return errorEmail.textContent = "Please enter your email";
    errorEmail.textContent = "";

    let result = await msgSendAndGetReply("password-reset-request", {"email":email, "username":username});
    if (result["error"] != undefined)
    {
        let error = result["error"];
        if (error.toLowerCase().indexOf("username") != -1)
            return errorUsername.textContent = error;
        else if (error.toLowerCase().indexOf("email") != -1)
            return errorEmail.textContent = error;
        else
            errorEmail.textContent = error;
        return;
    }

    console.log(result);
    alert("Password reset email sent! You can close this page now.");
}