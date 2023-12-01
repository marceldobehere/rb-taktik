let dbInterface;

function initApp(_dbInterface)
{
    dbInterface = _dbInterface;

    console.log("> Initialized account interface");
}

const defaultUserObject = {
    "username": "",
    "email": "",
    "user-id": "",
    "password-hash": "",
    "password-salt": ""
}

function checkUserObject(userObject)
{
    if (typeof userObject != "object")
        return false;

    for (let key in defaultUserObject)
        if (userObject[key] == undefined)
            return false;

    return true;
}

function makeUserObjectConform(userObject)
{
    if (typeof userObject != "object")
        return defaultUserObject;

    for (let key in defaultUserObject)
        if (userObject[key] == undefined)
            userObject[key] = defaultUserObject[key];

    return userObject;
}

function createUser(userId, userObject)
{
    if (!checkUserObject(userObject))
        return false;

    userObject = makeUserObjectConform(userObject);

    dbInterface.addPair("users", userId, userObject);
    return true;
}

function getUser(userId)
{
    let userObject = dbInterface.getPair("users", userId);
    if (userObject == undefined)
        return undefined;

    return makeUserObjectConform(userObject);
}

function updateUser(userId, userObject)
{
    if (!checkUserObject(userObject))
        return false;

    userObject = makeUserObjectConform(userObject);

    dbInterface.updatePair("users", userId, userObject);
    return true;
}

function deleteUser(userId)
{
    dbInterface.deletePair("users", userId);
    return true;
}

function getAllUsers()
{
    let users = dbInterface.getAllKeys("users");

    let result = [];
    for (let i = 0; i < users.length; i++)
        result.push(getUser(users[i]));

    return result;
}

module.exports = {initApp, createUser, getUser, updateUser, deleteUser, getAllUsers};