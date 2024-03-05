let resetId = undefined;

let errorPassword = document.getElementById("error-password");
let errorPasswordAgain = document.getElementById("error-password-again");


async function ResetInit()
{
    let Password = document.getElementById("input-password");
    let PasswordAgain = document.getElementById("input-password-again");
    attachOnEnterHandler(Password, () => PasswordAgain.focus());
    attachOnEnterHandler(PasswordAgain, submitClick);


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

function togglePWVisibility(passwordId) {
    let password = document.getElementById(passwordId);
    let eyeIcon = password.parentElement.querySelector(".eyeIcon");

    if (password.type === "password") {
        password.type = "text";
        eyeIcon.src = "/shared/images/eyeIconOpen.png";
    } else {
        password.type = "password";
        eyeIcon.src = "/shared/images/eyeIconClosed.png";
    }
}

onModulesImported.push(ResetInit);

const btns = document.querySelectorAll(".sound");

btns.forEach(function(btn) {
  let hoverSoundPlayed = false;

  btn.addEventListener("click", function() {
    fxAudioMenuButtonClick.play()
      .then(() => {
        console.log("fx played");
      })
      .catch(() => {
        // console.error("error");
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
        //   console.error("error");
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
