let sessionDict;

const exampleSessionObject = {
    socket: undefined,
    userId: undefined,
    sessionId: undefined,
}

function initApp()
{
    sessionDict = {};

    console.log("> Initialized session system");
}

function createSession(sessionId, sessionObj)
{
    sessionDict[sessionId] = sessionObj;
}

function getSession(sessionId)
{
    return sessionDict[sessionId];
}

function getSessionByUserId(userId)
{
    let sessionIds = getAllSessionIds();
    for (let i = 0; i < sessionIds.length; i++)
    {
        let sessionObj = getSession(sessionIds[i]);
        if (sessionObj.userId === userId)
            return sessionObj;
    }
    return undefined;
}

function updateSession(sessionId, sessionObj)
{
    sessionDict[sessionId] = sessionObj;
}

function updateSessionSocket(sessionId, socket)
{
    sessionDict[sessionId].socket = socket;
}

function getSessionBySocket(socket)
{
    let sessionIds = getAllSessionIds();
    for (let i = 0; i < sessionIds.length; i++)
    {
        let sessionObj = getSession(sessionIds[i]);
        if (sessionObj.socket === socket)
            return sessionObj;
    }
    return undefined;
}

function deleteSession(sessionId)
{
    delete sessionDict[sessionId];
}

function getAllSessionIds()
{
    return Object.keys(sessionDict);
}

module.exports = {initApp, createSession, deleteSession, getSession, updateSession, getAllSessionIds, updateSessionSocket, getSessionBySocket, getSessionByUserId};