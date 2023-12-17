let dbInterface;

async function initApp(_dbInterface)
{
    dbInterface = _dbInterface;

    if (! await dbInterface.tableExists("users"))
        await dbInterface.createTable("users");

    await createUser("test1234", {
        "username": "Testo",
        "email": "test@test.com",
        "userId": "test1234",
        "password-hash": "test",
        "password-salt": "test"
    });

    console.log("> Initialized account interface");
}

const defaultUserObject = {
    "username": "",
    "email": "",
    "userId": "",
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

async function createUser(userId, userObject)
{
    if (!checkUserObject(userObject))
        return false;

    userObject = makeUserObjectConform(userObject);

    if (await getUserByUsername(userObject["username"]) != undefined)
        return false;

    await dbInterface.addPair("users", userId, userObject);
    return true;
}

async function getUser(userId)
{
    let userObject = await dbInterface.getPair("users", userId);
    if (userObject == undefined)
        return undefined;

    return makeUserObjectConform(userObject);
}

async function getUserByUsername(username)
{
    let users = await getAllUsers();
    for (let i = 0; i < users.length; i++)
        if (users[i]["username"] == username)
            return users[i];

    return undefined;
}

async function updateUser(userId, userObject)
{
    if (!checkUserObject(userObject))
        return false;

    userObject = makeUserObjectConform(userObject);

    await dbInterface.updatePair("users", userId, userObject);
    return true;
}

async function deleteUser(userId)
{
    await dbInterface.deletePair("users", userId);
    return true;
}

async function getAllUsers()
{
    let users = await dbInterface.getAllKeys("users");

    let result = [];
    for (let i = 0; i < users.length; i++)
        result.push(await getUser(users[i]));

    return result;
}

module.exports = {initApp, createUser, getUser, updateUser, deleteUser, getAllUsers, getUserByUsername};