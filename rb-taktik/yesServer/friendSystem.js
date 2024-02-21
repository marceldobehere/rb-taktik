let app;
let io;
let notificationSystem;
let friendInterface;
let accountInterface;
let sessionSystem;

let pendingRequests = [];


function initApp(_app, _io, _notificationSystem, _friendInterface, _accountInterface, _sessionSystem)
{
    app = _app;
    io = _io;
    notificationSystem = _notificationSystem;
    friendInterface = _friendInterface;
    accountInterface = _accountInterface;
    sessionSystem = _sessionSystem;
    pendingRequests = [];

    io.on('connection', (socket) => {
        socket.on('get-friends', async () => {
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('get-friends', {error: "Invalid session"});

            let friends = await friendInterface.getAllFriendsForUser(sessionObj.userId);
            if (friends === undefined)
                return socket.emit('get-friends', {error: "Failed to get friends"});

            socket.emit('get-friends', {friends: friends});
        });

        socket.on('am-friends', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('am-friends', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('am-friends', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('am-friends', {error: "Invalid user id"});

            let areFriends = await friendInterface.areFriends(userId1, userId2);
            socket.emit('am-friends', {areFriends: areFriends});
        });

        socket.on('get-pending-friends', async () => {
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('get-pending-friends', {error: "Invalid session"});

            let pendingFriends = getAllPendingForUser(sessionObj.userId);
            if (pendingFriends === undefined)
                return socket.emit('get-pending-friends', {error: "Failed to get pending friends"});

            socket.emit('get-pending-friends', {pendingFriends: pendingFriends});
        });

        socket.on('cancel-pending', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('cancel-pending', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('cancel-pending', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('cancel-pending', {error: "Invalid user id"});

            if (!removePending(userId1, userId2))
                return socket.emit('cancel-pending', {error: "Failed to remove pending"});

            socket.emit('cancel-pending', {});
        });

        socket.on('am-pending', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('am-pending', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('am-pending', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('am-pending', {error: "Invalid user id"});

            let pending = isPending(userId1, userId2);
            socket.emit('am-pending', {isPending: pending});
        });

        socket.on('request-friend', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('request-friend', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('request-friend', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('request-friend', {error: "Invalid user id"});

            if (await friendInterface.areFriends(userId1, userId2))
                return socket.emit('request-friend', {error: "Already friends"});

            if (isPending(userId1, userId2))
                return socket.emit('request-friend', {error: "Already pending"});

            if (!addPending(userId1, userId2))
                return socket.emit('request-friend', {error: "Failed to add pending"});

            if (!await notificationSystem.sendFriendRequest(userId1, userId2))
                return socket.emit('request-friend', {error: "Failed to send notification"});

            socket.emit('request-friend', {});
        });

        socket.on('accept-friend', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('accept-friend', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('accept-friend', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('accept-friend', {error: "Invalid user id"});

            if (!isPending(userId1, userId2))
                return socket.emit('accept-friend', {error: "Not pending / Expired"});

            if (!await friendInterface.addFriend(userId1, userId2))
                return socket.emit('accept-friend', {error: "Failed to add friend"});

            if (!await notificationSystem.sendNowFriends(userId1, userId2))
                return socket.emit('accept-friend', {error: "Failed to send notification"});

            if (!await notificationSystem.sendNowFriends(userId2, userId1))
                return socket.emit('accept-friend', {error: "Failed to send notification"});

            if (!removePending(userId1, userId2))
                return socket.emit('accept-friend', {error: "Failed to remove pending"});

            socket.emit('accept-friend', {});
        });

        socket.on('decline-friend', async (obj) => {
            let userSess1 = sessionSystem.getSessionBySocket(socket);
            if (userSess1 === undefined)
                return socket.emit('decline-friend', {error: "Invalid session"});
            let userId1 = userSess1.userId;

            let userId2 = obj.userId;
            if (userId2 === undefined)
                return socket.emit('decline-friend', {error: "Invalid user id"});
            if (await accountInterface.getUser(userId2) === undefined)
                return socket.emit('decline-friend', {error: "Invalid user id"});

            if (!isPending(userId1, userId2))
                return socket.emit('decline-friend', {error: "Not pending / Expired"});

            if (!removePending(userId1, userId2))
                return socket.emit('decline-friend', {error: "Failed to remove pending"});

            socket.emit('decline-friend', {});
        });
    });

    console.log("> Initialized friend system");
}

function getPendingIndex(userId1, userId2)
{
    for (let i = 0; i < pendingRequests.length; i++)
    {
        if (pendingRequests[i].userId1 === userId1 && pendingRequests[i].userId2 === userId2)
            return i;
        if (pendingRequests[i].userId2 === userId1 && pendingRequests[i].userId1 === userId2)
            return i;
    }
    return -1;
}

function getAllPendingForUser(userId)
{
    let pending = [];
    for (let i = 0; i < pendingRequests.length; i++)
    {
        if (pendingRequests[i].userId1 === userId || pendingRequests[i].userId2 === userId)
            pending.push(pendingRequests[i]);
    }
    return pending;
}


function isPending(userId1, userId2)
{
    return getPendingIndex(userId1, userId2) !== -1;
}

function addPending(userId1, userId2)
{
    if (isPending(userId1, userId2))
        return false;
    pendingRequests.push({userId1: userId1, userId2: userId2});
    return true;
}

function removePending(userId1, userId2)
{
    let index = getPendingIndex(userId1, userId2);
    if (index === -1)
        return false;
    pendingRequests.splice(index, 1);
    return true;
}

module.exports = {initApp};