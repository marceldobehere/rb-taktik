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

    // console.log(await addFriend(1647441421, 1097865169));
    // console.log(await getAllFriendsForUser(1647441421));
    // console.log(await areFriends(1647441421, 1097865169));
    // console.log(await removeFriend(1647441421, 1097865169));
    // console.log(await getAllFriendsForUser(1647441421));

    console.log("> Initialized friend interface");
}

async function getAllFriendsForUser(userId)
{
    let friendUser = await dbInterface.getPair("friends", userId);
    if (friendUser === undefined)
        return [];

    return friendUser.friends;
}

async function areFriends(userId1, userId2)
{
    let friendUser1 = await dbInterface.getPair("friends", userId1);
    if (friendUser1 === undefined)
        return false;

    let friendUser2 = await dbInterface.getPair("friends", userId2);
    if (friendUser2 === undefined)
        return false;

    if (friendUser1.friends.includes(userId2) && friendUser2.friends.includes(userId1))
        return true;
    else
    {
        if (friendUser1.friends.includes(userId2))
        {
            console.log(`${userId1} has ${userId2} as friend but ${userId2} doesn't have ${userId1} as friend. Deleting friendship.`);
            friendUser1.friends.splice(friendUser1.friends.indexOf(userId2), 1);
            await dbInterface.updatePair("friends", userId1, friendUser1);
        }
        else if (friendUser2.friends.includes(userId1))
        {
            console.log(`${userId2} has ${userId1} as friend but ${userId1} doesn't have ${userId2} as friend. Deleting friendship.`);
            friendUser2.friends.splice(friendUser2.friends.indexOf(userId1), 1);
            await dbInterface.updatePair("friends", userId2, friendUser2);
        }

        return false;
    }
}

async function getOrCreateUserFriendEntry(userId)
{

    let friendUser = await dbInterface.getPair("friends", userId);
    if (friendUser === undefined)
    {
        if (await accountInterface.getUser(userId) == undefined)
            return undefined;
        friendUser = {friends: []};
        await dbInterface.addPair("friends", userId, friendUser);
    }

    return friendUser;
}

async function addFriend(userId1, userId2)
{
    let friendUser1 = await getOrCreateUserFriendEntry(userId1);
    if (friendUser1 === undefined)
        return false;

    let friendUser2 = await getOrCreateUserFriendEntry(userId2);
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
    let friendUser1 = await dbInterface.getPair("friends", userId1);
    if (friendUser1 === undefined)
        return false;

    let friendUser2 = await dbInterface.getPair("friends", userId2);
    if (friendUser2 === undefined)
        return false;

    if (! await areFriends(userId1, userId2))
        return false;

    friendUser1.friends.splice(friendUser1.friends.indexOf(userId2), 1);
    await dbInterface.updatePair("friends", userId1, friendUser1);

    friendUser2.friends.splice(friendUser2.friends.indexOf(userId1), 1);
    await dbInterface.updatePair("friends", userId2, friendUser2);

    return true;
}

async function deleteAllFriendsForUser(userId)
{
    let friendUser = await dbInterface.getPair("friends", userId);
    if (friendUser === undefined)
        return false;

    for (let i = 0; i < friendUser.friends.length; i++)
    {
        let friendUser2 = await dbInterface.getPair("friends", friendUser.friends[i]);
        if (friendUser2 !== undefined)
        {
            console.log(`${userId} friends with a non-existent person! (${friendUser2})`);
            continue;
        }

        friendUser2.friends.splice(friendUser2.friends.indexOf(userId), 1);
        await dbInterface.updatePair("friends", friendUser.friends[i], friendUser2);
    }

    await dbInterface.deletePair("friends", userId);
    return true;
}


module.exports = {initApp, getAllFriendsForUser, areFriends, addFriend, removeFriend, deleteAllFriendsForUser};
