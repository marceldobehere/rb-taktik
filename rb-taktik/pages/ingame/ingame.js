let messagePopupBox = document.getElementById("msg-popup-box");


function resetBoard()
{
    hideMessage();
}
resetBoard();

async function createGame()
{
    // get username
    let username = prompt("Please enter your username");

    let result = await msgSendAndGetReply("game-create", {"username":username});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    console.log(result);
}

async function joinGame()
{
    let roomId = prompt("Please enter the room ID");
    let username = prompt("Please enter your username");

    let result = await msgSendAndGetReply("game-join", {"username":username, "id":roomId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    console.log(result);
}

function startGame()
{

}

function stopGame()
{

}




msgHook("game-leave", (data) => {
    alert("The opponent has left the game.");
    resetBoard();
});

msgHook("game-join", (data) => {
    console.log("The opponent has joined the game.");
});


function fieldClicked(element) {
    console.log(element);
}


function showMessage()
{
    messagePopupBox.style.display = "block";
}

function hideMessage()
{
    messagePopupBox.style.display = "none";
}