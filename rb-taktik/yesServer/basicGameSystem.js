let app;
let io;
let sessionStuff;
let dbStuff;

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
                "settings": {}
            };

            gameDict[id] = gameEntry;

            socket.emit("game-create", {
                "id": gameEntry["id"],
                "players": gameEntry["players"],
                "settings": gameEntry["settings"]
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

            socket.emit("game-join", {
                "id": gameEntry["id"],
                "players": gameEntry["players"],
                "settings": gameEntry["settings"]
            });

            for (let socket of gameEntry["sockets"])
                socket.emit("game-join", {
                    "id": gameEntry["id"],
                    "players": gameEntry["players"],
                    "settings": gameEntry["settings"]
                });

            console.log(gameDict);
        });

        socket.on('game-leave', (obj) => {

        });

        socket.on('game-settings', (obj) => {

        });

        socket.on('game-message', (obj) => {

        });
    });

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