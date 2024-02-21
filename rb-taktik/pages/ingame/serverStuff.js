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
    alert("Your room ID is: " + result["id"]);

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

async function startGame()
{
    let result = await msgSendAndGetReply("game-start", {username:playerNames[playerNumber]});
    if (result["error"] != undefined)
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
}

async function init()
{
    msgHook("game-leave", (data) => {
        alert("The opponent has left the game.");
        //resetBoard();
        goPage("/home")
    });

    msgHook("game-join", (data) => {
        console.log("The opponent has joined the game.");
        console.log(data);
        loadGameState(data["state"]);
    });

    msgHook("game-start", (data) => {
        gameStarted(data);
    });

    msgHook("game-move", (data) => {
        loadGameState(data["state"]);
        console.log(data);
    });

    msgHook("game-win", (data) => {
        console.log("Game won/lost!", data);
        loadGameState(data["state"]);
        if (data["state"]["gameWinner"] == playerNumber)
            showMessage("You won!");
        else
            showMessage("You lost");
    });

    msgHook("chat-message", (data) => {
        addMessage(data["username"], (data["playerIndex"] == 0) ? "red" : "blue", data["message"]);
    });

    await attemptJoinFromUrl();
}

async function attemptJoinFromUrl()
{
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log("Url params:", params);
    let roomId = params["gameid"];
    if (roomId == undefined)
        return;
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