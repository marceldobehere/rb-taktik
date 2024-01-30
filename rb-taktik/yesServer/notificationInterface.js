let dbInterface;
let accountInterface;

async function initApp(_dbInterface, _accountInterface)
{
    dbInterface = _dbInterface;
    accountInterface = _accountInterface;

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

    if (notEntry == undefined)
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
    if (notEntry == undefined)
        return false;

    // add all entries from unread to read and clear the unread array
    notEntry.read.push(...notEntry.unread);
    notEntry.unread = [];

    await dbInterface.updatePair("notifications", userId, notEntry);
    return true;
}

async function clearAllNotificationsForUser(userId)
{
    if (await dbInterface.getPair("notifications", userId) == undefined)
        return false;

    await dbInterface.updatePair("notifications", userId, {
        unread: [],
        read: []
    });
    return true;
}

async function createNotificationForUser(userId, notification)
{
    // let userObject = await accountInterface.getUser(userId);
    // if (userObject == undefined)
    //     return false;

    let notEntry = await dbInterface.getPair("notifications", userId);

    if (notEntry == undefined)
        notEntry = {
            unread: [],
            read: []
        };

    notEntry.unread.push(notification);
    await dbInterface.updatePair("notifications", userId, notEntry);
    return true;
}

async function deleteNotificationEntry(userId)
{
    await dbInterface.deletePair("notifications", userId);
}


module.exports = {initApp};