let app;
let io;
let accountInterface;
let sessionSystem;
let rankingSystem;

let gameDict = {};

function removeGamesWithPlayer(playerSocket) {
    for (let key in gameDict) {
        if (gameDict[key]["sockets"].indexOf(playerSocket) !== -1) {
            for (let socket of gameDict[key]["sockets"])
                socket.emit("game-leave", {});

            delete gameDict[key];
        }
    }

    console.log(gameDict);
}

function getGameWithPlayer(playerSocket) {
    for (let key in gameDict) {
        if (gameDict[key]["sockets"].indexOf(playerSocket) !== -1) {
            return gameDict[key];
        }
    }

    return undefined;
}

function resetGameState(entry)
{
    entry["state"] = {
        "board": [
            undefined, undefined, undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined],
        "playerPoints": [0,0],
        "playerTurn": 0,
        "gameRunning": false,
        "gameWinner": undefined,
        "playerStacks": [[999,4,3,2], [999,4,3,2]],
        "playerNames": ["N/A", "N/A"]
    };
}

function resetGame(entry)
{
    entry["state"]["board"] = [
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined];

    entry["state"]["playerTurn"] = 0;
    entry["state"]["gameRunning"] = false;
    entry["state"]["gameWinner"] = undefined;
    entry["state"]["playerStacks"] = [[999,4,3,2], [999,4,3,2]];
}

function checkWin(entry)
{
    let state = entry["state"];
    let board = state["board"];

    if (state["gameWinner"] !== undefined || !state["gameRunning"])
        return false;

    // check for same player with the same rules as Tic-Tac-Toe

    // vertical
    for (let i = 0; i < 3; i++)
    {
        if (board[i] !== undefined &&
            board[i+3] !== undefined &&
            board[i+6] !== undefined &&
            board[i]["player"] === board[i+3]["player"] &&
            board[i]["player"] === board[i+6]["player"])
        {
            return true;
        }
    }

    // horizontal
    for (let i = 0; i < 9; i += 3)
    {
        if (board[i] !== undefined &&
            board[i+1] !== undefined &&
            board[i+2] !== undefined &&
            board[i]["player"] === board[i+1]["player"] &&
            board[i]["player"] === board[i+2]["player"])
        {
            return true;
        }
    }

    // diagonal 1
    if (board[0] !== undefined &&
        board[4] !== undefined &&
        board[8] !== undefined &&
        board[0]["player"] === board[4]["player"] &&
        board[0]["player"] === board[8]["player"])
    {
        return true;
    }

    // diagonal 2
    if (board[2] !== undefined &&
        board[4] !== undefined &&
        board[6] !== undefined &&
        board[2]["player"] === board[4]["player"] &&
        board[2]["player"] === board[6]["player"])
    {
        return true;
    }

    // check if player cannot place any pieces
    for (let p = 0; p < 2; p++)
    {
        let canPlace = false;
        for (let piece = 3; piece >= 0; piece--)
        {
            if (state["playerStacks"][p][piece] < 1)
                continue;

            for (let i = 0; i < 9; i++)
            {
                if (board[i] !== undefined &&
                    board[i]["piece"] >= piece)
                    continue;

                canPlace = true;
                break;
            }
        }

        if (!canPlace)
        {
            //state["playerTurn"] = (p + 1) % 2;
            return true;
        }
    }

    return false;
}

function initApp(_app, _io, _accountInterface, _sessionSystem, _rankingSystem) {
    app = _app;
    io = _io;
    accountInterface = _accountInterface;
    sessionSystem = _sessionSystem;
    rankingSystem = _rankingSystem;

    io.on('connection', (socket) => {
        console.log("User connected");

        socket.on('disconnect', () => {
            console.log("User disconnected");
            removeGamesWithPlayer(socket);
        });

        socket.on('game-exists', (obj) => {
            console.log("Game exists");

            let id = obj["id"];
            socket.emit("game-exists", {"exists": (gameDict[id] !== undefined)});
        });

        socket.on('game-create', async () => {
            console.log("Game create");

            let session = sessionSystem.getSessionBySocket(socket);
            let user = undefined;
            if (session)
                user = await accountInterface.getUser(session.userId);

            let username = user ? user.username : "Guest";

            removeGamesWithPlayer(socket);

            let id = Math.floor(Math.random() * 1000000000);
            while (gameDict[id])
                id = Math.floor(Math.random() * 1000000000);

            let gameEntry = {
                "id": id,
                "players": [username],
                "playerIds": [session ? session.userId : undefined],
                "sockets": [socket],
                "settings": {},
                "state": {}
            };

            resetGameState(gameEntry);

            gameEntry["state"]["playerNames"][0] = username;

            gameDict[id] = gameEntry;

            socket.emit("game-create", {
                "id": gameEntry["id"],
                "players": gameEntry["players"],
                "playerIds": gameEntry["playerIds"],
                "settings": gameEntry["settings"],
                "state": gameEntry["state"]
            });

            console.log(gameDict);
        });

        socket.on('game-join', async (obj) => {
            console.log("Game join");
            removeGamesWithPlayer(socket);

            let session = sessionSystem.getSessionBySocket(socket);
            let user = undefined;
            if (session)
                user = await accountInterface.getUser(session.userId);

            let username = user ? user.username : "Guest";

            let id = obj["id"];

            if (!gameDict[id])
                return socket.emit("game-join", {"error": "Invalid Room ID"});

            let gameEntry = gameDict[id];

            if (gameEntry["sockets"].indexOf(socket) !== -1)
                return socket.emit("game-join", {"error": "Already in game"});

            if (gameEntry["players"].length >= 2)
                return socket.emit("game-join", {"error": "Game is full"});

            gameEntry["players"].push(username);
            gameEntry["playerIds"].push(session ? session.userId : undefined);
            gameEntry["sockets"].push(socket);
            gameEntry["state"]["playerNames"][1] = username;

            socket.emit("game-join", {
                "id": gameEntry["id"],
                "players": gameEntry["players"],
                "playerIds": gameEntry["playerIds"],
                "settings": gameEntry["settings"],
                "state": gameEntry["state"]
            });

            for (let socket of gameEntry["sockets"])
                socket.emit("game-join", {
                    "id": gameEntry["id"],
                    "players": gameEntry["players"],
                    "playerIds": gameEntry["playerIds"],
                    "settings": gameEntry["settings"],
                    "state": gameEntry["state"]
                });

            console.log(gameDict);
        });

        socket.on('game-leave', () => {
            removeGamesWithPlayer(socket);
        });

        socket.on('game-start', () => {
            let game = getGameWithPlayer(socket);
            console.log(game);

            if (!game)
                return socket.emit("game-start", {"error": "Not in any game"});

            if (game["players"].length < 2)
                return socket.emit("game-start", {"error": "Not enough players"});

            if (game["state"]["gameRunning"])
                return socket.emit("game-start", {"error": "Game already running"});

            resetGame(game);

            game["state"]["gameRunning"] = true;

            socket.emit("game-start", {});

            for (let socket of game["sockets"])
                socket.emit("game-start", {
                    "id": game["id"],
                    "players": game["players"],
                    "playerIds": game["playerIds"],
                    "settings": game["settings"],
                    "state": game["state"]
                });
        });

        socket.on('game-stop', () => {
            let game = getGameWithPlayer(socket);

            if (!game)
                return socket.emit("game-stop", {"error": "Not in game"});

            if (!game["state"]["gameRunning"])
                return socket.emit("game-stop", {"error": "Game not running"});

            game["state"]["gameRunning"] = false;

            socket.emit("game-stop", {});

            for (let socket of game["sockets"])
                socket.emit("game-stop", {
                    "id": game["id"],
                    "players": game["players"],
                    "settings": game["settings"],
                    "state": game["state"]
                });
        });

        socket.on('game-move', (obj) => {
            let gameEntry = getGameWithPlayer(socket);

            (() => {
                if (obj === undefined || obj["field"] === undefined || obj["piece"] === undefined)
                    return socket.emit("game-move", {"error": "Invalid Session"});

                let field = obj["field"];
                let piece = obj["piece"];



                if (!gameEntry)
                    return socket.emit("game-move", {"error": "Invalid Game ID"});

                let state = gameEntry["state"];

                if (!state["gameRunning"])
                    return socket.emit("game-move", {"error": "Game not running"});

                if (state["gameWinner"] !== undefined)
                    return socket.emit("game-move", {"error": "Game already over"});

                if (state["playerTurn"] !== gameEntry["sockets"].indexOf(socket))
                    return socket.emit("game-move", {"error": "Not your turn"});

                if (piece < 0 || piece > 3)
                    return socket.emit("game-move", {"error": "Invalid piece"});

                if (state["board"][field] !== undefined)
                {
                    if (state["board"][field]["piece"] >= piece)
                        return socket.emit("game-move", {"error": "Field already occupied"});
                }

                if (state["playerStacks"][state["playerTurn"]][piece] <= 0)
                    return socket.emit("game-move", {"error": "Not enough pieces"});

                state["board"][field] = {player: state["playerTurn"], piece: piece};
                state["playerStacks"][state["playerTurn"]][piece] -= 1;

                state["playerTurn"] = (state["playerTurn"] + 1) % 2;

                socket.emit("game-move", {state});
            })();

            if (gameEntry)
            {
                let won = checkWin(gameEntry);
                if (won &&
                    gameEntry["state"]["gameWinner"] === undefined)
                {
                    gameEntry["state"]["gameWinner"] = (gameEntry["state"]["playerTurn"] + 1) % 2;
                    gameEntry["state"]["playerPoints"][gameEntry["state"]["gameWinner"]] += 1;

                    gameEntry["state"]["gameRunning"] = false;
                }

                let state = gameEntry["state"];

                if (won)
                {
                    for (let socket of gameEntry["sockets"])
                        socket.emit("game-win", {state});
                }
                else
                {
                    for (let socket of gameEntry["sockets"])
                        socket.emit("game-move", {state});
                }
            }
        });

        socket.on('game-settings', (obj) => {

        });

        socket.on('chat-message', async (obj) => {
            console.log("Chat message received", obj);
            let game = getGameWithPlayer(socket);

            if (!game)
                return socket.emit("chat-message", {"error": "Not in game"});

            let session = sessionSystem.getSessionBySocket(socket);
            let user = undefined;
            if (session)
                user = await accountInterface.getUser(session.userId);

            let username = user ? user.username : "Guest";

            socket.emit("chat-message", {success: true});

            let playerIndex = game["sockets"].indexOf(socket);

            for (let socket of game["sockets"])
                socket.emit("chat-message", {
                    "username": username,
                    "playerIndex": playerIndex,
                    "message": obj["message"]
                });
        })
    });

    console.log("> Initialized basic game System");
}

module.exports = {initApp};