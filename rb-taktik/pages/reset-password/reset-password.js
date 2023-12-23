let resetId = undefined;

let errorPassword = document.getElementById("error-password");
let errorPasswordAgain = document.getElementById("error-password-again");


async function ResetInit()
{
    const urlParams = new URLSearchParams(window.location.search);
    resetId = urlParams.get('resetId');
    if (resetId == undefined)
        return alert("Invalid reset ID");
}

function clearErrors()
{
    errorPassword.textContent = "";
    errorPasswordAgain.textContent = "";
}
clearErrors();

async function submitClick()
{
    clearErrors();

    let password = document.getElementById("input-password").value;
    if (password == "")
        return errorPassword.textContent = "Please enter a password";

    let password2 = document.getElementById("input-password-again").value;
    if (password2 == "")
        return errorPasswordAgain.textContent = "Please enter your password again";

    if (password != password2)
        return errorPasswordAgain.textContent = "Passwords do not match";

    let result = await msgSendAndGetReply("password-reset-verify", {"resetId":resetId, "newPassword":password});
    if (result["error"] != undefined)
    {
        let error = result["error"];
        errorPasswordAgain.textContent = error;
        return;
    }

    console.log(result);
    goPage("/login");
}

onModulesImported.push(ResetInit);