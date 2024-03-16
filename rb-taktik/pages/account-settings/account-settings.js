const userNameElement = document.getElementById("username");
const emailElement = document.getElementById("email");

function copyProfileLink()
{
    if (isGuest)
        return;

    let link = window.location.origin + "/profile/profile.html?userid=" + userData["userId"];
    prompt("Please copy the following link:", link);
}

async function changeUsername()
{
    if (isGuest)
        return;

    let newUsername = prompt("Please enter your new username");
    if (newUsername == null)
        return;

    let reply = await msgSendAndGetReply("change-username", {sessionId:sessionId, newUsername: newUsername});
    if (reply.error !== undefined)
    {
        alert("Failed to change username: " + reply.error);
        return;
    }

    await refreshUserData();
    await accSettingInit();
    alert("Username changed");
}

async function changeEmail()
{
    if (isGuest)
        return;

    let newEmail = prompt("Please enter your new email");
    if (newEmail == null)
        return;

    let reply = await msgSendAndGetReply("change-email", {sessionId:sessionId, newEmail: newEmail});
    if (reply.error !== undefined)
    {
        alert("Failed to change email: " + reply.error);
        return;
    }

    await refreshUserData();
    await accSettingInit();
    alert("Email changed");
}

async function changePassword()
{
    if (isGuest)
        return;

    let currentPassword = prompt("Please enter your current password");
    if (currentPassword == null)
        return;

    let reply1 = await msgSendAndGetReply("login", {username:userData["username"], password: currentPassword});
    if (reply1.error !== undefined)
    {
        alert("Invalid password");
        return;
    }
    setSessionId(reply1.sessionId);

    let newPassword = prompt("Please enter your new password");
    if (newPassword == null)
        return;
    let newPassword2 = prompt("Please re-enter your new password");
    if (newPassword2 == null)
        return;

    if (newPassword !== newPassword2)
    {
        alert("Passwords do not match");
        return;
    }

    let reply2 = await msgSendAndGetReply("change-password", {sessionId:sessionId, newPassword: newPassword});
    if (reply2.error !== undefined)
    {
        alert("Failed to change password: " + reply2.error);
        return;
    }
    alert("Password changed");
}

async function accSettingInit()
{
    if (isGuest)
    {
        goPage("/home");
        return;
    }

    userNameElement.textContent = userData["username"];
    emailElement.textContent = userData["email"];
}

onModulesImported.push(accSettingInit);

startBgm(bgmMenuAudio);

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
