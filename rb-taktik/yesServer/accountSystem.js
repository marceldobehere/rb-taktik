let app;
let io;
let accountInterface;
let securityInterface;
let sessionSystem;

async function initApp(_app, _io, _accountInterface, _securityInterface, _sessionSystem)
{
    app = _app;
    io = _io;
    accountInterface = _accountInterface;
    securityInterface = _securityInterface;
    sessionSystem = _sessionSystem;

    io.on('connection', (socket) => {

    });


    console.log("> Initialized account system");
}

async function registerUser(username, email, password)
{
if (await accountInterface.getUserByUsername(username))
        return false;

    let passwordObject = await securityInterface.hashPassword(password);
    let userObject = {
        "username": username,
        "email": email,
        "user-id": securityInterface.getRandomInt(10000, 10000000000),
        "password-hash": passwordObject.hash,
        "password-salt": passwordObject.salt
    };

    return await accountInterface.createUser(username, userObject);
}

async function loginUser(username, password)
{
    let userObject = await accountInterface.getUserByUsername(username);
    if (userObject == undefined)
        return false;

    if (await securityInterface.checkPassword(password, userObject["password-salt"], userObject["password-hash"]))
    {
        throw new Error("TODO: IMPLEMENT SESSION");
        // create session using socket and userid
        let sessionId = undefined;
        return sessionId;
    }

    return false;
}

async function logoutUser(sessionId)
{
    throw new Error("TODO: IMPLEMENT SESSION");
    //return await sessionSystem.deleteSession(sessionId);
}

async function deleteUser(sessionId)
{
    throw new Error("TODO: IMPLEMENT SESSION");
    //let userId = await sessionSystem.getUserId(sessionId);
    //return await accountInterface.deleteUser(userId);
}

async function updateUser(sessionId, userObject)
{
    throw new Error("TODO: IMPLEMENT SESSION");
    //let userId = await sessionSystem.getUserId(sessionId);
    //return await accountInterface.updateUser(userId, userObject);
}

module.exports = {initApp, loginUser, registerUser, logoutUser, deleteUser, updateUser};