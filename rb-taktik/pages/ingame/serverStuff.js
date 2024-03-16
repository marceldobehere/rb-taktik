async function createGame()
{
    // // get username
    // let username = prompt("Please enter your username");
    // playerId = username;
    // if (username == null)
    //     return;

    let result = await msgSendAndGetReply("game-create", {});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    console.log(result["id"]);
    currentRoomId = result["id"];
    //alert("Your room ID is: " + result["id"]);

    // red
    playerNumber = 0;
    loadGameState(result["state"]);
    clearChat();
}

async function joinGame()
{
    let roomId = prompt("Please enter the room ID");
    if (roomId == null)
        return;
    // let username = prompt("Please enter your username");
    // playerId = username;
    // if (username == null)
    //     return;

    let result = await msgSendAndGetReply("game-join", {"id":roomId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    // blue
    currentRoomId = roomId;
    playerNumber = 1;
    resetBoard();
    clearChat();
}

function createInviteLink()
{
    const urlWithoutParams = window.location.href.split("?")[0];
    const url = urlWithoutParams + "?gameid=" + currentRoomId;

    prompt("Please copy the following link:", url);
}

async function startGame(ignoreError)
{
    let result = await msgSendAndGetReply("game-start", {username:playerNames[playerNumber]});
    if (result["error"] != undefined && !ignoreError)
    {
        alert("Error: " + result["error"])
        return;
    }

}

async function gameStarted(obj)
{
    console.log("Game started");
    loadGameState(obj["state"]);
    gameRunning = true;
    document.getElementById("invite-link-div").style.display = "none";
}

async function init()
{
    msgHook("game-leave",  (data) => {
        //resetBoard();

        setTimeout(() => {
            if (playerPoints[0] >= 3 || playerPoints[1] >= 3)
            {
                hideMessage();
                return;
            }

            alert("The opponent has left the game.");
            goPage("/home")
        }, 500);
    });

    msgHook("game-join", async (data) => {
        console.log("The opponent has joined the game.");
        console.log(data);
        loadGameState(data["state"]);

        if (playerNumber == 0)
        {
            await startGame();
        }
    });

    msgHook("game-start", (data) => {
        gameStarted(data);
        console.log(data);
        hideMessage(true);

        const viewProfileElementR = document.getElementById('view-profile-r');
        const viewProfileElementB = document.getElementById('view-profile-b');
        const pfpRed = document.getElementsByClassName("player-image-red");
        const pfpBlue = document.getElementsByClassName("player-image-b");

        if(playerNumber == 0){
            viewProfileElementR.remove();
            if(data["playerIds"][1] == undefined){
                viewProfileElementB.remove();
            }
            else{
                viewProfileElementB.addEventListener('click', function() {
                    window.open("http://localhost/profile/profile.html?userid=" + data["playerIds"][1], '_blank').focus();
                });
            }
        }
        else{
            viewProfileElementB.remove();
            if(data["playerIds"][0] == undefined){
                viewProfileElementR.remove();
            }
            else{
                viewProfileElementR.addEventListener('click', function() {
                    window.open("http://localhost/profile/profile.html?userid=" + data["playerIds"][0], '_blank').focus();
                });
            }
        }

        if(data["playerIds"][0] == undefined){
            pfpRed.src="/shared/images/guestPFP.png"
        }
        else{
            pfpRed.src="/shared/images/placeHolderPFP.png"
        }

        if(data["playerIds"][1] == undefined){
            pfpBlue.src="/shared/images/guestPFP.png"
        }
        else{
            pfpBlue.src="/shared/images/placeHolderPFP.png"
        }


    });

    msgHook("game-move", (data) => {
        loadGameState(data["state"]);
        console.log(data);
    });

    msgHook("game-win", (data) => {
        console.log("Game won/lost!", data);
        loadGameState(data["state"]);
        if (data["state"]["gameWinner"] == playerNumber){
            pauseBgm();
            fxAudioWin.play();
            showMessage("You won!");
        }
           
        else
        {
            pauseBgm();
            fxAudioLose.play();
            showMessage("You lost");

        }
    });

    msgHook("chat-message", (data) => {
        addMessage(data["username"], (data["playerIndex"] == 0) ? "red" : "blue", data["message"]);
    });

    msgHook('decline-challenge', (data) => {
        console.log("DECLINE: ", data);
        let tempRoomId = data["roomId"];
        let tempUserId = data["userId"];
        if (tempRoomId === undefined || tempUserId === undefined)
            return;

        if (tempRoomId != currentRoomId)
            return;

        alert(`The user has declined your match request!`);
        goPage("/home")
    });

    await attemptJoinFromUrl();
}

async function attemptJoinFromUrl()
{
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log("Url params:", params);

    let matchUp = params["matchUp"];
    if (matchUp)
    {
        await createGame();
        let reply = await msgSendAndGetReply('match-set-room', {roomId: currentRoomId});
        if (reply["error"])
        {
            alert(`There was an error setting the room: ${reply["error"]}`);
            goPage("/home");
        }
        console.log("Match set room:", reply);
        return;
    }

    let challengeFriendId = params["challengeFriend"];
    if (challengeFriendId != undefined)
    {
        challengeFriendId = parseInt(challengeFriendId);

        //alert("CHALLENGING: " + challengeFriendId);


        await createGame();

        //alert("ROOM ID: " + currentRoomId);

        let challengeSent = await msgSendAndGetReply('challenge-user', {userId: challengeFriendId, roomId: currentRoomId});

        if (challengeSent["error"])
        {
            alert(`There was an error challenging the user: ${challengeSent["error"]}`);
            goPage("/home");
        }

        return;
    }

    let roomId = params["gameid"];
    if (roomId == undefined)
    {
        await createGame();
        return;
    }
    console.log("Attempting to join game with id:", roomId);

    let result = await msgSendAndGetReply("game-join", {"id":roomId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    // blue
    currentRoomId = roomId;
    playerNumber = 1;
    resetBoard();
    clearChat();
}


onModulesImported.push(init);