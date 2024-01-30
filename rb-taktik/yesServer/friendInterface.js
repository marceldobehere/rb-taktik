let dbInterface;
let accountInterface;
let securityInterface;
let notificationInterface;

async function initApp(_dbInterface, _notificationInterface, _accountInterface, _securityInterface)
{
    dbInterface = _dbInterface;
    notificationInterface = _notificationInterface;
    accountInterface = _accountInterface;
    securityInterface = _securityInterface;

    if (! await dbInterface.tableExists("friends"))
        await dbInterface.createTable("friends");

    console.log("> Initialized friend interface");
}

async function getAllFriendsForUser(userId)
{
    let friendUser = await dbInterface.getPair("notifications", userId);
    if (friendUser === undefined)
        return [];

    return friendUser.friends;
}

async function areFriends(userId1, userId2)
{
    let friendUser1 = await dbInterface.getPair("notifications", userId1);
    if (friendUser1 === undefined)
        return false;

    let friendUser2 = await dbInterface.getPair("notifications", userId2);
    if (friendUser2 === undefined)
        return false;

    return friendUser1.friends.includes(userId2) && friendUser2.friends.includes(userId1);
}

async function getUserThing(userId)
{
    if (await _accountInterface.getUser(userId) == undefined)
        return undefined;

    let friendUser = await dbInterface.getPair("notifications", userId);
    if (friendUser === undefined)
    {
        friendUser = {friends: []};
        await dbInterface.addPair("friends", userId, friendUser);
    }

    return friendUser;
}

async function addFriend(userId1, userId2)
{
    let friendUser1 = getUserThing(userId1);
    if (friendUser1 === undefined)
        return false;

    let friendUser2 = getUserThing(userId2);
    if (friendUser2 === undefined)
        return false;

    if (await areFriends(userId1, userId2))
        return false;

    friendUser1.friends.push(userId2);
    await dbInterface.updatePair("friends", userId1, friendUser1);

    friendUser2.friends.push(userId1);
    await dbInterface.updatePair("friends", userId2, friendUser2);

    return true;
}

async function removeFriend(userId1, userId2)
{
    return false;
}

async function deleteAllFriendsForUser(userId)
{
    return false;
}


module.exports = {initApp, getAllFriendsForUser, areFriends, addFriend, removeFriend, deleteAllFriendsForUser};
