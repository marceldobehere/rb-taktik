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
            let sessionId = await loginUser(obj.username, obj.password, socket);
            if (sessionId === false)
                return socket.emit('login', {error: "Invalid username or password"});


            socket.emit('login', {sessionId: sessionId});
        });

        socket.on('logout', async (obj) => {
            let res = await logoutUser(obj.sessionId);
            socket.emit('logout', {success: res});
        });

        socket.on('register', async (obj) => {
            console.log("Registering user " + obj.username + " with email " + obj.email);
            if (await registerUser(obj.username, obj.email, obj.password) === false)
                return socket.emit('register', {error: "Username already taken"});

            console.log("Registered user " + obj.username + " with email " + obj.email);
            // login as well
            let sessionId = await loginUser(obj.username, obj.password, socket);
            if (sessionId === false)
                return socket.emit('register', {error: "Invalid username or password"});

            console.log("Logged in user " + obj.username + " with email " + obj.email);
            socket.emit('register', {sessionId: sessionId});
        });

        socket.on('change-password', async (obj) => {
            let user = await getUser(obj.sessionId, socket);
            if (user === undefined)
                return socket.emit('change-password', {error: "Invalid session"});
            let userId = user.userId;

            let res = await changeUserPassword(userId, obj.newPassword);
            if (res === false)
                return socket.emit('change-password', {error: "Invalid session"});

            socket.emit('change-password', {});
        });

        socket.on('change-email', async (obj) => {
            let user = await getUser(obj.sessionId, socket);
            if (user === undefined)
                return socket.emit('change-email', {error: "Invalid session"});
            let userId = user.userId;

            let userObject = await accountInterface.getUser(userId);
            userObject.email = obj.newEmail;
            let res = await accountInterface.updateUser(userId, userObject);
            if (res === false)
                return socket.emit('change-email', {error: "Invalid session"});

            socket.emit('change-email', {});
        });

        socket.on('change-username', async (obj) => {
            let user = await getUser(obj.sessionId, socket);
            if (user === undefined)
                return socket.emit('change-username', {error: "Invalid session"});
            let userId = user.userId;

            let possibleUser = await accountInterface.getUserByUsername(obj.newUsername);
            if (possibleUser !== undefined)
                return socket.emit('change-username', {error: "Username already taken"});

            let userObject = await accountInterface.getUser(userId);
            userObject.username = obj.newUsername;
            let res = await accountInterface.updateUser(userId, userObject);
            if (res === false)
                return socket.emit('change-username', {error: "Invalid session"});

            socket.emit('change-username', {});
        });

        socket.on('get-user', async (obj) => {
            let user = await getUser(obj.sessionId, socket);
            if (user === undefined)
                return socket.emit('get-user', {error: "Invalid session"});

            let userRes = {
                username: user.username,
                email: user.email,
                userId: user.userId,
                rank: user.rank
            }

            socket.emit('get-user', userRes);
        });

        socket.on('get-user-info', async (obj) => {
            let user = await accountInterface.getUser(obj.userId);
            if (user === undefined)
                return socket.emit('get-user-info', {error: "Invalid user id"});

            let userRes = {
                username: user.username,
                userId: user.userId,
                rank: user.rank
            }

            socket.emit('get-user-info', userRes);
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
        "password-salt": passwordObject.salt,
        "rank": 600
    };

    return await accountInterface.createUser(userObject.userId, userObject);
}

async function changeUserPassword(userId, password)
{
    let userObject = await accountInterface.getUser(userId);
    if (userObject === undefined)
        return false;

    let passwordObject = await securityInterface.hashPassword(password);
    userObject["password-hash"] = passwordObject.hash;
    userObject["password-salt"] = passwordObject.salt;

    return await accountInterface.updateUser(userObject.userId, userObject);
}

async function loginUser(username, password, socket)
{
    let userObject = await accountInterface.getUserByUsername(username);
    if (userObject === undefined)
        return false;

    if (await securityInterface.checkPassword(password, userObject["password-salt"], userObject["password-hash"]))
    {
        let sessionObj = sessionSystem.getSessionByUserId(userObject.userId);
        if (sessionSystem.getSessionByUserId(userObject.userId) !== undefined)
            sessionSystem.deleteSession(sessionObj.sessionId);


        let sessionId = securityInterface.getRandomInt(1000000, 999999999999);
        sessionSystem.createSession(sessionId, {
            socket: socket,
            userId: userObject.userId,
            sessionId: sessionId,
        });
        return sessionId;
    }

    return false;
}

async function getUser(sessionId, socket)
{
    let userObj = sessionSystem.getSession(sessionId);
    if (userObj === undefined)
        return undefined;
    userObj.socket = socket;
    sessionSystem.updateSession(sessionId, userObj);

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
    if (userObj === undefined)
        return false;

    let userId = userObj.userId;
    sessionSystem.deleteSession(sessionId);

    return await accountInterface.deleteUser(userId);
}

async function updateUser(sessionId, userObject)
{
    let user = await sessionSystem.getSession(sessionId);
    if (user === undefined)
        return false;

    let userId = user.userId;
    return await accountInterface.updateUser(userId, userObject);
}

module.exports = {initApp, loginUser, registerUser, logoutUser, deleteUser, updateUser, getUser, changeUserPassword};