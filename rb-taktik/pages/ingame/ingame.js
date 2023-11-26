let messagePopupBox = document.getElementById("msg-popup-box");
let messagePopupText = document.getElementById("msg-popup-box-text");
let gameRunning = false;
let gameWinner = undefined;
let playerNumber = 0;
let playerId = undefined;
let playerTurn = 0;
let playerPoints = [0,0];
let playerStacks = [[999,4,3,2], [999,4,3,2]];
let playerStackElements = [];
let selectedStack = 0;
const playerChars = ["r", "b"];
const playerColors = ["red", "blue"];
let fields = [];
let board = [];
let playerNames = ["N/A", "N/A"];


async function init()
{
    let gameBoard = document.getElementById("game-board");
    fields = [];
    for (let child of gameBoard.children)
        fields.push(child);

    selectedStack = -1;
    playerStackElements = [];
    for (let s = 0; s < 2; s++)
    {
        let temp = [];
        for (let p = 0; p < 4; p++)
        {
            let elem = document.getElementById("player-" + playerChars[s] + "-" + (p+1));
            temp.push(elem);
            elem.parentElement.onclick = () => {
                stackSelected(elem, s, p);
            }
        }
        playerStackElements.push(temp);
    }

    resetAll();
}

function getIndex(elem)
{
    for (let i = 0; i < fields.length; i++)
        if (fields[i] == elem)
            return i;
    return -1;
}

function resetAll()
{
    playerNumber = 0;
    playerStacks = [[999,4,3,2], [999,4,3,2]];
    playerPoints = [0,0];
    resetBoard();
}

function resetBoard()
{
    gameRunning = false;
    gameWinner = undefined;
    playerTurn = 0;
    selectedStack = -1;
    hideMessage();

    board = [];
    for (let i = 0; i < 9; i++)
        board.push(undefined);

    for (let s = 0; s < 2; s++)
        for (let p = 0; p < 4; p++)
        {
            let elem = playerStackElements[s][p];
            elem.parentElement.style.color = "";
            elem.textContent = playerStacks[s][p]+"x";
        }

    drawBoard();
}

function drawBoard()
{
    // Fields
    for (let i = 0; i < 9; i++)
    {
        let field = fields[i];
        let item = board[i];
        if (item == undefined)
        {
            field.style.backgroundColor = "";
            field.textContent = "";
        }
        else
        {
            field.style.backgroundColor = playerColors[item["player"]];
            field.textContent = "R"+(item["piece"] + 1);
        }
    }


    // Player Stacks
    for (let p = 0; p < 2; p++)
    {
        for (let i = 0; i < 4; i++)
        {
            let elem = document.getElementById("player-" + playerChars[p] + "-" + (i+1));

            elem.textContent = playerStacks[p][i]+"x";
        }
    }

    // Player Points
    for (let p = 0; p < 2; p++)
    {
        let elem = document.getElementById("player-vs-" + playerChars[p]);
        elem.textContent = playerPoints[p];
    }

    // Player Names
    for (let p = 0; p < 2; p++)
    {
        let elem = document.getElementById("player-name-" + playerChars[p]);
        elem.textContent = playerNames[p];
        if (p == playerNumber)
            elem.style.backgroundColor = "white";
        else
            elem.style.backgroundColor = "#DDDDDD";
    }

    // Player Turn
    {
        let elem = document.getElementById("player-turn");
        elem.textContent = playerNames[playerTurn];
    }
}


function stackSelected(element, stackIndex, pieceIndex)
{
    if (stackIndex != playerNumber || !gameRunning || gameWinner != undefined)
        return;

    if (selectedStack != -1)
        playerStackElements[playerNumber][selectedStack].parentElement.style.color = "";

    element.parentElement.style.color = "yellow";
    selectedStack = pieceIndex;

}

async function fieldClicked(element) {
    if (!gameRunning || gameWinner != undefined || playerTurn != playerNumber || selectedStack == -1)
        return;

    let idx = getIndex(element);

    // if (board[idx] != undefined)
    //     return;

    //element.style.backgroundColor = playerColors[playerNumber];
    playerTurn = (playerTurn + 1) % 2;

    let reply = await msgSendAndGetReply("game-move", {"player":playerId, "field":idx, "piece": selectedStack});
    if (reply["error"] != undefined)
    {
        console.log("Error: ", reply["error"]);
        return;
    }
    loadGameState(reply["state"]);


}

function loadGameState(state)
{
    if (state == undefined)
        return;

    board = state["board"];
    playerTurn = state["playerTurn"];
    gameRunning = state["gameRunning"];
    gameWinner = state["gameWinner"];
    playerStacks = state["playerStacks"];
    playerPoints = state["playerPoints"];
    playerNames = state["playerNames"];


    drawBoard();
}


function showMessage(msg)
{
    if (msg)
        messagePopupText.textContent = msg;
    messagePopupBox.style.display = "block";
}

function hideMessage()
{
    messagePopupBox.style.display = "none";
}


onModulesImported.push(init);