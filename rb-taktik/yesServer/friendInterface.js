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
    return [];
}

async function areFriends(userId1, userId2)
{
    return false;
}

async function addFriend(userId1, userId2)
{
    return false;
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
