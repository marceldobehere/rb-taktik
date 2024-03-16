async function doRegister()
{
    let username = document.getElementById("input-username").value;
    if (username == "")
        return alert("Please enter a username");

    let password = document.getElementById("input-password").value;
    if (password == "")
        return alert("Please enter a password");

    let email = document.getElementById("input-email").value;
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

function initRegister()
{
    let inputUsername = document.getElementById("input-username");
    let inputPassword = document.getElementById("input-password");
    let inputMail = document.getElementById("input-email");
    attachOnEnterHandler(inputMail, () => inputUsername.focus());
    attachOnEnterHandler(inputUsername, () => inputPassword.focus());
    attachOnEnterHandler(inputPassword, doRegister);
}

onModulesImported.push(initRegister);

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
