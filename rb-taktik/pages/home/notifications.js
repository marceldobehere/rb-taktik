async function loadNotifications(data)
{
    console.log("Notifications: ", data);
}

async function createFriendNotification(not)
{

}

async function createChallengeNotification(not)
{

}

async function createServerNotification(not)
{

}

async function notInit()
{
    msgHook('notification', loadNotifications);

    socket.emit('notification', {});
}

onModulesImported.push(notInit);