let app;
let io;
let accountInterface;
let sessionSystem;
let rankingSystem;

let waitingRandomSockets = [];
let waitingRankedSockets = [];
let waitingRankedRanks = [];

function removeSocketFromWaitingLists(socket)
{
    let index = waitingRandomSockets.indexOf(socket);
    if (index != -1)
        waitingRandomSockets.splice(index, 1);

    index = waitingRankedSockets.indexOf(socket);
    if (index != -1)
    {
        waitingRankedSockets.splice(index, 1);
        waitingRankedRanks.splice(index, 1);
    }
}

async function connectPlayers(player1, player2)
{
    console.log(`> CONNECTING MATCH: `, player1, player2);
}

async function tryConnectRandomMatch()
{
    if (waitingRandomSockets.length < 2)
        return;

    let player1 = waitingRandomSockets.shift();
    let player2 = waitingRandomSockets.shift();

    // Send match infos to players
    await connectPlayers(player1, player2);
}

async function tryConnectRankedMatch()
{
    if (waitingRandomSockets.length < 2)
        return;

    for (let i = 0; i < waitingRankedSockets.length; i++)
    {
        let player1 = waitingRankedSockets[i];
        let player1Rank = waitingRankedRanks[i];

        for (let i2 = i + 1; i2 < waitingRankedSockets.length; i2++)
        {
            let player2 = waitingRankedSockets[i2];
            let player2Rank = waitingRankedRanks[i2];

            if (player1Rank !== player2Rank)
                continue;

            // Remove 2nd player first
            waitingRankedSockets.splice(i2, 1);
            waitingRankedRanks.splice(i2, 1);

            // Remove 1st player
            waitingRankedSockets.splice(i, 1);
            waitingRankedRanks.splice(i, 1);

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
        });

        socket.on('start-wait-random', async (obj) => {
            removeSocketFromWaitingLists(socket);
            waitingRandomSockets.push(socket);
            await tryConnectRandomMatch();

            socket.emit('start-wait-random', {});
        });

        socket.on('start-wait-ranked', async (obj) => {
            removeSocketFromWaitingLists(socket);

            let session = sessionSystem.getSession(socket.id);
            if (session === undefined)
                return socket.emit('start-wait-ranked', {error: "You are not logged in."});

            let user = await accountInterface.getUser(session.userId);
            if (user === undefined)
                return socket.emit('start-wait-ranked', {error: "Invalid user."});

            let rank = rankingSystem.getRankNumberFromLevel(user["rank"]);
            console.log("Rank: " + rank);

            waitingRankedSockets.push(socket);
            waitingRankedRanks.push(rank);

            await tryConnectRankedMatch();
        });
    });

    console.log("> Initialized waiting system");
}


module.exports = {initApp};