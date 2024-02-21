function joinGame() {
    goPage("/ingame")
}

function openOptions() {
    goPage("/settings")
}

function joinRankedGame() {
    joinGame();
}

function joinRandomGame() {
    joinGame();
}


function createGame() {
    joinGame();
}


async function doLogout() {
    let result = await msgSendAndGetReply("logout", { "sessionId": sessionId });
    if (result["error"] != undefined) {
        alert("Error: " + result["error"])
        return;
    }

    setSessionId(null);
    goPage("/login")
}

async function homeInit() {
    if (isGuest) {
        document.getElementById("info-username").textContent = "Guest";
        document.getElementById("info-rank").textContent = "None";
        document.getElementById("info-pfp").src = "/shared/images/guestPFP.png";

        document.getElementById("acc-login-logout").textContent = "Login";

        disableBtn("btn-ranked");
        disableBtn("btn-random");
        document.getElementById("friend-list-cont").style.display = "none";
    }
    else {
        document.getElementById("info-username").textContent = userData["username"];
        document.getElementById("info-rank").textContent = userData["rank"];
        document.getElementById("info-pfp").src = "/shared/images/placeHolderPFP.png";

        document.getElementById("acc-login-logout").textContent = "Logout";
    }

    await loadFriendList();
}



onModulesImported.push(homeInit);

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
