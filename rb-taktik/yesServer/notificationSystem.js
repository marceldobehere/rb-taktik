let app;
let io;
let notificationInterface;
let accountInterface;
let sessionSystem;

function initApp(_app, _io, _notificationInterface, _accountInterface, _sessionSystem)
{
    app = _app;
    io = _io;
    notificationInterface = _notificationInterface;
    accountInterface = _accountInterface;
    sessionSystem = _sessionSystem;

    io.on('connection', (socket) => {
        socket.on('notification', async () => {
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('notification', {error: "Invalid session"});

            await notifyUser(sessionObj.userId);
        });

        socket.on('read-notification', async (obj) => {
            if (obj === undefined)
                return socket.emit('read-notification', {error: "Invalid request"});
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('read-notification', {error: "Invalid session"});
            if (obj.notificationId === undefined)
                return socket.emit('read-notification', {error: "Invalid notification id"});

            if (await notificationInterface.readNotificationsForUser(sessionObj.userId, obj.notificationId))
            {
                socket.emit('read-notification', {});
                await notifyUser(sessionObj.userId);
            }
            else
                socket.emit('read-notification', {error: "Failed to read notification"});
        });

        socket.on('clear-notifications', async () => {
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('clear-notifications', {error: "Invalid session"});

            if (await notificationInterface.readNotificationsForUser(sessionObj.userId))
                return socket.emit('clear-notifications', {});
            else
                return socket.emit('clear-notifications', {error: "Failed to clear notifications"});
        });

        socket.on('clear-notification', async (obj) => {
            if (obj === undefined)
                return socket.emit('read-notification', {error: "Invalid request"});
            let sessionObj = sessionSystem.getSessionBySocket(socket);
            if (sessionObj === undefined)
                return socket.emit('clear-notification', {error: "Invalid session"});
            if (obj.notificationId === undefined)
                return socket.emit('clear-notification', {error: "Invalid notification id"});

            if (await notificationInterface.clearNotificationForUser(sessionObj.userId, obj.notificationId))
                return socket.emit('clear-notification', {});
            else
                return socket.emit('clear-notification', {error: "Failed to clear notification"});
        });
    });

    console.log("> Initialized notification system")
}

async function notifyUser(userId)
{
    let sessionObj = sessionSystem.getSessionByUserId(userId);
    if (sessionObj === undefined)
        return false;

    let notifications = await notificationInterface.getAllNotificationsForUser(userId);
    sessionObj.socket.emit('notification', notifications);
    return true;
}

async function sendFriendRequest(userIdFrom, userIdTo)
{
    let userFrom = await accountInterface.getUser(userIdFrom);
    let userTo = await accountInterface.getUser(userIdTo);

    if (userFrom === undefined || userTo === undefined)
        return false;

    let not = {
        type: "friend-req",
        from: userIdFrom,
        title: "Friend Request",
        text: `${userFrom.username} sent you a friend request!`,
        date: Date.now()
    };

    if (await notificationInterface.createNotificationForUser(userIdTo, not))
        return false;

    await notifyUser(userIdTo);
    return true;
}

async function sendNowFriends(userIdFrom, userIdTo)
{
    let userFrom = await accountInterface.getUser(userIdFrom);
    let userTo = await accountInterface.getUser(userIdTo);

    if (userFrom === undefined || userTo === undefined)
        return false;

    let not = {
        type: "friend-accept",
        from: userIdFrom,
        title: "Friend Status",
        text: `You are now friends with ${userTo.username}!`,
        date: Date.now()
    };

    if (await notificationInterface.createNotificationForUser(userIdFrom, not))
        return false;

    await notifyUser(userIdFrom);
    return true;
}


async function sendMatchRequest(userIdFrom, userIdTo, roomId)
{
    let userFrom = await accountInterface.getUser(userIdFrom);
    let userTo = await accountInterface.getUser(userIdTo);

    if (userFrom === undefined || userTo === undefined)
        return false;

    let not = {
        type: "match-req",
        from: userIdFrom,
        title: "Match Request",
        text: `${userFrom.username} sent you a match request!`,
        date: Date.now(),
        roomId: roomId
    };

    if (await notificationInterface.createNotificationForUser(userIdTo, not))
        return false;

    await notifyUser(userIdTo);
    return true;
}



module.exports = {initApp, notifyUser, sendFriendRequest, sendNowFriends, sendMatchRequest};