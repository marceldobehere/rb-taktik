async function createGame()
{
    // get username
    let username = prompt("Please enter your username");
    playerId = username;

    let result = await msgSendAndGetReply("game-create", {"username":username});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    console.log(result["id"]);

    // red
    playerNumber = 0;
    loadGameState(result["state"])
}

async function joinGame()
{
    let roomId = prompt("Please enter the room ID");
    let username = prompt("Please enter your username");
    playerId = username;

    let result = await msgSendAndGetReply("game-join", {"username":username, "id":roomId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    // blue
    playerNumber = 1;
    resetBoard();
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
        resetBoard();
    });

    msgHook("game-join", (data) => {
        console.log("The opponent has joined the game.");
        loadGameState(data["state"]);
    });

    msgHook("game-start", (data) => {
        gameStarted(data);
    });

    msgHook("game-move", (data) => {
        console.log("Game move received", data);
        loadGameState(data["state"]);
    });

    msgHook("game-win", (data) => {
        console.log("Game won/lost!", data);
        loadGameState(data);
    });
}


onModulesImported.push(init);