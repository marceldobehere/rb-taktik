let dbInterface;
let accountInterface;
let securityInterface;

async function initApp(_dbInterface, _accountInterface, _securityInterface)
{
    dbInterface = _dbInterface;
    accountInterface = _accountInterface;
    securityInterface = _securityInterface;

    if (! await dbInterface.tableExists("notifications"))
        await dbInterface.createTable("notifications");

    // Testing functions
    await deleteNotificationEntry("test1234");
    //console.log(await getAllNotificationsForUser("test1234"));
    await createNotificationForUser("test1234", {title: "Test 1", type: "msg", text:"This is a test!"});
    //console.log(await getAllNotificationsForUser("test1234"));
    await readNotificationsForUser("test1234");
    //console.log(await getAllNotificationsForUser("test1234"));
    await createNotificationForUser("test1234", {title: "Test 2", type: "msg", text:"This is a test!"});
    //console.log(await getAllNotificationsForUser("test1234"));
    await readNotificationsForUser("test1234");
    //console.log(await getAllNotificationsForUser("test1234"));
    await clearAllNotificationsForUser("test1234");
    //console.log(await getAllNotificationsForUser("test1234"));
    await deleteNotificationEntry("test1234");


    console.log("> Initialized notification interface");
}

async function getAllNotificationsForUser(userId)
{
    let notEntry = await dbInterface.getPair("notifications", userId);

    if (notEntry === undefined)
        return {
            unread: [],
            read: []
        };

    return {
        unread: notEntry.unread,
        read: notEntry.read
    };
}

async function readNotificationsForUser(userId)
{
    let notEntry = await dbInterface.getPair("notifications", userId);
    if (notEntry === undefined)
        return false;

    // add all entries from unread to read and clear the unread array
    notEntry.read.unshift(...notEntry.unread);
    notEntry.unread = [];

    await dbInterface.updatePair("notifications", userId, notEntry);
    return true;
}

async function readNotificationForUser(userId, notificationId)
{
    let notEntry = await dbInterface.getPair("notifications", userId);
    if (notEntry === undefined)
        return false;

    let index = notEntry.unread.findIndex((element) => {
        return element.id === notificationId;
    });

    if (index === -1)
        return false;

    notEntry.read.unshift(notEntry.unread[index]);
    notEntry.unread.splice(index, 1);
    await dbInterface.updatePair("notifications", userId, notEntry);
    return true;
}

async function clearAllNotificationsForUser(userId)
{
    if (await dbInterface.getPair("notifications", userId) === undefined)
        return false;

    await dbInterface.updatePair("notifications", userId, {
        unread: [],
        read: []
    });
    return true;
}


async function clearNotificationForUser(userId, notificationId)
{
    let notEntry = await dbInterface.getPair("notifications", userId);
    if (notEntry === undefined)
        return false;

    let index = notEntry.unread.findIndex((element) => {
        return element.id === notificationId;
    });

    if (index === -1)
    {
        index = notEntry.read.findIndex((element) => {
            return element.id === notificationId;
        });

        if (index === -1)
            return false;
        else
        {
            notEntry.read.splice(index, 1);
            await dbInterface.updatePair("notifications", userId, notEntry);
            return true;
        }
    }
    else
    {
        notEntry.unread.splice(index, 1);
        await dbInterface.updatePair("notifications", userId, notEntry);
        return true;
    }
}

async function createNotificationForUser(userId, notification)
{
    // let userObject = await accountInterface.getUser(userId);
    // if (userObject == undefined)
    //     return false;

    let notEntry = await dbInterface.getPair("notifications", userId);

    if (notEntry === undefined)
        notEntry = {
            unread: [],
            read: []
        };

    notification["id"] = securityInterface.getRandomInt(1000000, 999999999999);

    notEntry.unread.unshift(notification);
    await dbInterface.updatePair("notifications", userId, notEntry);
    return true;
}

async function deleteNotificationEntry(userId)
{
    await dbInterface.deletePair("notifications", userId);
}


module.exports = {initApp, getAllNotificationsForUser, readNotificationsForUser, clearAllNotificationsForUser, createNotificationForUser, deleteNotificationEntry, clearNotificationForUser, readNotificationForUser};