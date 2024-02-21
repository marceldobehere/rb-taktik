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
function initPwForgot()
{
    let inputUsername = document.getElementById("input-username");
    let inputMail = document.getElementById("input-email");
    attachOnEnterHandler(inputUsername, () => inputMail.focus());
    attachOnEnterHandler(inputMail,submitClick);
}

onModulesImported.push(initPwForgot);

const btns = document.querySelectorAll(".sound");

btns.forEach(function(btn) {
  let hoverSoundPlayed = false;

  btn.addEventListener("click", function() {
    fxAudioMenuButtonClick.play()
      .then(() => {
        console.log("fx played");
      })
      .catch(() => {
        console.error("error");
      });
  });

  btn.addEventListener("mouseover", function() {
    if (!hoverSoundPlayed) {
      fxAudioMenuButtonHover.volume = 0.25;
      fxAudioMenuButtonHover.play()
        .then(() => {
          console.log("hover sound played");
        })
        .catch(() => {
          console.error("error");
        });
      hoverSoundPlayed = true;
    }
  });

  btn.addEventListener("mouseout", function(event) {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || (relatedTarget !== btn && !btn.contains(relatedTarget))) {
      hoverSoundPlayed = false;
    }
  });
});
