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
        socket.on('login', async (obj) => {
            let sessionId = await loginUser(obj.username, obj.password);
            if (sessionId == false)
                return socket.emit('login', {error: "Invalid username or password"});


            socket.emit('login', {sessionId: sessionId});
        });

        socket.on('register', async (obj) => {
            if (await registerUser(obj.username, obj.email, obj.password) == false)
                return socket.emit('register', {error: "Username already taken"});

            // login aswell
            let sessionId = await loginUser(obj.username, obj.password);
            if (sessionId == false)
                return socket.emit('login', {error: "Invalid username or password"});

            socket.emit('login', {sessionId: sessionId});
        });
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
        "userId": securityInterface.getRandomInt(10000, 10000000000),
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
        let sessionObj = sessionSystem.getSessionByUserId(userObject.userId);
        if (sessionSystem.getSessionByUserId(userObject.userId) != undefined)
            sessionSystem.deleteSession(sessionObj.sessionId);


        let sessionId = securityInterface.getRandomInt(1000000, 999999999999);
        sessionSystem.createSession(sessionId, {
            socket: undefined,
            userId: userObject.userId,
            sessionId: sessionId,
        });
        return sessionId;
    }

    return false;
}

async function getUser(sessionId)
{
    let userObj = sessionSystem.getSession(sessionId);
    if (userObj == undefined)
        return undefined;

    return await accountInterface.getUser(userObj.userId);
}

async function logoutUser(sessionId)
{
    sessionSystem.deleteSession(sessionId);
    return true;
}

async function deleteUser(sessionId)
{
    let userObj = sessionSystem.getSession(sessionId);
    if (userObj == undefined)
        return false;

    let userId = userObj.userId;
    sessionSystem.deleteSession(sessionId);

    return await accountInterface.deleteUser(userId);
}

async function updateUser(sessionId, userObject)
{
    let user = await sessionSystem.getSession(sessionId);
    if (user == undefined)
        return false;

    let userId = user.userId;
    return await accountInterface.updateUser(userId, userObject);
}

module.exports = {initApp, loginUser, registerUser, logoutUser, deleteUser, updateUser, getUser};