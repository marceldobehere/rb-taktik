let app;
let io;
let accountInterface;
let sessionSystem;
let rankingSystem;

let waitingRandom = [];
let waitingRanked = [];

function removeSocketFromWaitingLists(socket)
{
    let index = waitingRandom.findIndex((obj) => obj.socket === socket);
    if (index !== -1)
        waitingRandom.splice(index, 1);

    index = waitingRanked.findIndex((obj) => obj.socket === socket);
    if (index !== -1)
        waitingRanked.splice(index, 1);
}

async function connectPlayers(player1, player2)
{
    console.log(`> CONNECTING MATCH: ${player1.userId} and ${player2.userId}`);

    player1.socket.emit('connect-match', {});
    player2.socket.emit('connect-match', {});
}

async function tryConnectRandomMatch()
{
    if (waitingRandom.length < 2)
        return;

    let player1 = waitingRandom.shift();
    let player2 = waitingRandom.shift();

    // Send match infos to players
    await connectPlayers(player1, player2);
}

async function tryConnectRankedMatch()
{
    if (waitingRanked.length < 2)
        return;

    for (let i = 0; i < waitingRanked.length; i++)
    {
        let player1 = waitingRanked[i];

        for (let i2 = i + 1; i2 < waitingRanked.length; i2++)
        {
            let player2 = waitingRanked[i2];

            if (player1.rank !== player2.rank)
                continue;

            // Remove 2nd player first
            waitingRanked.splice(i2, 1);

            // Remove 1st player
            waitingRanked.splice(i, 1);

            // Send match infos to players
            await connectPlayers(player1, player2);
            return;
        }
    }
}

function initApp(_app, _io, _accountInterface, _sessionSystem, _rankingSystem)
{
    app = _app;
    io = _io;
    accountInterface = _accountInterface;
    sessionSystem = _sessionSystem;
    rankingSystem = _rankingSystem;

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            removeSocketFromWaitingLists(socket);
            console.log(`> WAIT LEAVE`);
        });

        socket.on('start-wait-random', async () => {
            console.log(`> WAIT START RANDOM`);
            removeSocketFromWaitingLists(socket);

            let session = sessionSystem.getSessionBySocket(socket);
            if (session === undefined)
                return socket.emit('start-wait-random', {error: "Invalid session."});

            let user = await accountInterface.getUser(session.userId);
            if (user === undefined)
                return socket.emit('start-wait-random', {error: "Invalid user."});

            waitingRandom.push({userId: session.userId, socket: socket});
            socket.emit('start-wait-random', {});
            await tryConnectRandomMatch();
        });

        socket.on('start-wait-ranked', async () => {
            console.log(`> WAIT START RANKED`);
            removeSocketFromWaitingLists(socket);

            let session = sessionSystem.getSessionBySocket(socket);
            if (session === undefined)
                return socket.emit('start-wait-ranked', {error: "You are not logged in."});

            let user = await accountInterface.getUser(session.userId);
            if (user === undefined)
                return socket.emit('start-wait-ranked', {error: "Invalid user."});

            let rank = rankingSystem.getRankNumberFromLevel(user["rank"]);

            waitingRandom.push({userId: session.userId, socket: socket, rank: rank});
            socket.emit('start-wait-ranked', {});
            await tryConnectRankedMatch();
        });
    });

    console.log("> Initialized waiting system");
}


module.exports = {initApp};