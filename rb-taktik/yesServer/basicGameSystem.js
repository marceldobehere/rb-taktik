let app;
let io;

let sessionDict = {};
let gameDict = {};

function removeGamesWithPlayer(playerSocket) {
    for (let key in gameDict) {
        if (gameDict[key]["sockets"].indexOf(playerSocket) != -1) {
            for (let socket of gameDict[key]["sockets"])
                socket.emit("game-leave", {});

            delete gameDict[key];
        }
    }

    console.log(gameDict);
}

function getGameWithPlayer(playerSocket) {
    for (let key in gameDict) {
        if (gameDict[key]["sockets"].indexOf(playerSocket) != -1) {
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

    if (state["gameWinner"] != undefined || !state["gameRunning"])
        return false;

    // check for same player with the same rules as tic tac toe

    // vertical
    for (let i = 0; i < 3; i++)
    {
        if (board[i] != undefined &&
            board[i+3] != undefined &&
            board[i+6] != undefined &&
            board[i]["player"] == board[i+3]["player"] &&
            board[i]["player"] == board[i+6]["player"])
        {
            return true;
        }
    }

    // horizontal
    for (let i = 0; i < 9; i += 3)
    {
        if (board[i] != undefined &&
            board[i+1] != undefined &&
            board[i+2] != undefined &&
            board[i]["player"] == board[i+1]["player"] &&
            board[i]["player"] == board[i+2]["player"])
        {
            return true;
        }
    }

    // diagonal 1
    if (board[0] != undefined &&
        board[4] != undefined &&
        board[8] != undefined &&
        board[0]["player"] == board[4]["player"] &&
        board[0]["player"] == board[8]["player"])
    {
        return true;
    }

    // diagonal 2
    if (board[2] != undefined &&
        board[4] != undefined &&
        board[6] != undefined &&
        board[2]["player"] == board[4]["player"] &&
        board[2]["player"] == board[6]["player"])
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
                if (board[i] != undefined &&
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

function initApp(_app, _io) {
    app = _app;
    io = _io;


    io.on('connection', (socket) => {
        console.log("User connected");
        sessionDict[socket] = {};

        socket.on('disconnect', () => {
            console.log("User disconnected");
            removeGamesWithPlayer(socket);

            delete sessionDict[socket];
        });

        socket.on('game-create', (obj) => {
            console.log("Game create");
            if (obj == undefined || obj["username"] == undefined)
                return socket.emit("game-create", {"error": "Invalid Session"});

            let username = obj["username"];

            removeGamesWithPlayer(socket);

            let id = Math.floor(Math.random() * 1000000000);
            while (gameDict[id])
                id = Math.floor(Math.random() * 1000000000);

            let gameEntry = {
                "id": id,
                "players": [username],
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
                "settings": gameEntry["settings"],
                "state": gameEntry["state"]
            });

            console.log(gameDict);
        });

        socket.on('game-join', (obj) => {
            console.log("Game join");
            if (obj == undefined || obj["username"] == undefined || obj["id"] == undefined)
                return socket.emit("game-join", {"error": "Invalid Session"});

            let username = obj["username"];
            let id = obj["id"];

            if (!gameDict[id])
                return socket.emit("game-join", {"error": "Invalid Game ID"});

            let gameEntry = gameDict[id];

            if (gameEntry["players"].indexOf(username) != -1)
                return socket.emit("game-join", {"error": "Already in game"});

            if (gameEntry["players"].length >= 2)
                return socket.emit("game-join", {"error": "Game is full"});

            gameEntry["players"].push(username);
            gameEntry["sockets"].push(socket);
            gameEntry["state"]["playerNames"][1] = username;

            socket.emit("game-join", {
                "id": gameEntry["id"],
                "players": gameEntry["players"],
                "settings": gameEntry["settings"],
                "state": gameEntry["state"]
            });

            for (let socket of gameEntry["sockets"])
                socket.emit("game-join", {
                    "id": gameEntry["id"],
                    "players": gameEntry["players"],
                    "settings": gameEntry["settings"],
                    "state": gameEntry["state"]
                });

            console.log(gameDict);
        });

        socket.on('game-leave', (obj) => {
            removeGamesWithPlayer(socket);
        });

        socket.on('game-start', (obj) => {
            let game = getGameWithPlayer(socket);
            console.log(game);

            if (!game)
                return socket.emit("game-start", {"error": "Not in game"});

            if (game["players"].indexOf(obj["username"]) == -1)
                return socket.emit("game-start", {"error": "Not in game"});

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
                    "settings": game["settings"],
                    "state": game["state"]
                });
        });

        socket.on('game-stop', (obj) => {
            let game = getGameWithPlayer(socket);

            if (!game)
                return socket.emit("game-stop", {"error": "Not in game"});

            if (game["players"].indexOf(obj["username"]) == -1)
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
                if (obj == undefined || obj["player"] == undefined || obj["field"] == undefined || obj["piece"] == undefined)
                    return socket.emit("game-move", {"error": "Invalid Session"});

                let username = obj["player"];
                let field = obj["field"];
                let piece = obj["piece"];



                if (!gameEntry)
                    return socket.emit("game-move", {"error": "Invalid Game ID"});

                if (gameEntry["players"].indexOf(username) == -1)
                    return socket.emit("game-move", {"error": "Not in game"});

                let state = gameEntry["state"];

                if (!state["gameRunning"])
                    return socket.emit("game-move", {"error": "Game not running"});

                if (state["gameWinner"] != undefined)
                    return socket.emit("game-move", {"error": "Game already over"});

                if (state["playerTurn"] != gameEntry["players"].indexOf(username))
                    return socket.emit("game-move", {"error": "Not your turn"});

                if (piece < 0 || piece > 3)
                    return socket.emit("game-move", {"error": "Invalid piece"});

                if (state["board"][field] != undefined)
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
                    gameEntry["state"]["gameWinner"] == undefined)
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

        socket.on('game-message', (obj) => {

        });
    });

    console.log("> Initialized basic game System");
}

/*
socket.on('disconnect', () => {
            //console.log("User disconnected");
            let sessionObj = sessionStuff.getSessionFromSocket(socket);
            if (sessionObj)
            {
                sessionObj["session"]["socket"] = undefined;
                sessionStuff.updateSession(sessionObj["id"], sessionObj["session"]);
                //console.log(`> User disconnected: ${sessionObj["session"]["username"]}`);
            }
        });

        socket.on('settings-account', (obj) => {
        let session = obj["session"];
        let action = obj["action"];

            if (action == "update")
            {
                let username = sessionStuff.getUserNameFromSession(session);
                if (!username)
                {
                    let data = obj["data"];
                    let errorObj = {valid:false, action:action, data:data, error:"Invalid Session"};
                    console.log(errorObj);
                    socket.emit("settings-account", errorObj);
                    return;
                }
                let tempSession = sessionStuff.getSessionFromId(session);
                tempSession["socket"] = socket;
                sessionStuff.updateSession(session, tempSession);
                //console.log(`> User connected: ${username}`);
                let data = obj["data"];
                let dbEntry = dbStuff.getUser(username);
                if (dbEntry)
                {
                    console.log('FIELD:')
                    console.log(data);
                    let field = data["field"];
                    let error = undefined;
                    if (field == "pfp")
                    {
                        let pfp = data["data"];
                        dbEntry["profile-pic"] = pfp;
                        dbStuff.saveUser(dbEntry);
                    }
                    else if (field == "email")
                    {
                        let email = data["data"];
                        dbEntry["email"] = email;
                        dbStuff.saveUser(dbEntry);
                    }
                    else
                    {
                        error = "invalid field";
                    }


                    socket.emit("settings-account",
                        {
                            valid:(!error),
                            error:error,
                            action:action,
                            data:data
                        });
                    return;
                }
                else
                {
                    let data = obj["data"];
                    let errorObj = {valid:false, action:action, data:data, error:"Invalid User"};
                    console.log(errorObj);
                    socket.emit("settings-account", errorObj);
                    return;
                }
            }
            });

        socket.on('session', (obj) => {
            let session = obj["session"];
            let action = obj["action"];
            //console.log(`> User Session Stuff: Action: \"${action}\", Session: \"${session}\"`);
            if (action == "get data")
            {
                let username = sessionStuff.getUserNameFromSession(session);
                if (!username)
                {
                    socket.emit("session", {valid:false});
                    return;
                }
                let tempSession = sessionStuff.getSessionFromId(session);
                tempSession["socket"] = socket;
                sessionStuff.updateSession(session, tempSession);
                //console.log(`> User connected: ${username}`);

                let dbEntry = dbStuff.getUser(username);
                if (dbEntry)
                {
                    socket.emit("session",
                        {
                            valid:true,
                            "username":username,
                            "email":dbEntry["email"],
                            "profile-pic":dbEntry["profile-pic"]
                        });
                    return;
                }
                else
                {
                    sessionStuff.deleteSession(session);
                    socket.emit("session", {valid:false});
                    return;
                }
            }

        });
*/

module.exports = {initApp};