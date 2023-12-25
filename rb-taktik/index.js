const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


io.setMaxListeners(1000);


app.get('/', (req, res) => {
    res.redirect('/index/index.html');
});

app.get('/*', (req, res) => {
    let url = req.url;
    if (!url.startsWith('/shared/'))
    {
        if (url.indexOf(".") == -1)
        {
            res.redirect(url + url + ".html");
            return;
        }
        url = "/pages" + url;
    }

    url = url.replace("..", "");

    if (url.indexOf("?") != -1)
        url = url.substring(0, url.indexOf("?"));// url.split("?")[0];

    if (url.indexOf(".") != -1 && !fs.existsSync(__dirname + url))
        res.redirect('/404/404.html');
    else
        res.sendFile(__dirname + url);
});

// const sessionStuff = require("./yesServer/sessionStuff.js");
// sessionStuff.initApp(app, io);
//
// const dbStuff = require("./yesServer/simpleDB.js");
//
// const loginManager = require("./yesServer/loginHandling");
// loginManager.initApp(app, io, sessionStuff, dbStuff);
//
// const passwordRecoveryManager = require("./yesServer/passwordRecoveryHandling");
// passwordRecoveryManager.initApp(app, io, sessionStuff, dbStuff);
//
// const registerManager = require("./yesServer/registerHandling");
// registerManager.initApp(app, io, sessionStuff, dbStuff);
//
// const userManager = require("./yesServer/basicGameSystem.js");
// userManager.initApp(app, io, sessionStuff, dbStuff);
//
// const roomManager = require("./yesServer/roomManager.js");
// roomManager.initApp(app, io, sessionStuff, dbStuff, userManager);
//
// const shell = require("./yesServer/shell");
// shell.initApp(sessionStuff, dbStuff, loginManager, registerManager, userManager);


const fs = require("fs");

const dbInterface = require("./yesServer/dbInterface.js");
const accountInterface = require("./yesServer/accountInterface.js");
const accountSystem = require("./yesServer/accountSystem.js");
const basicGameSystem = require("./yesServer/basicGameSystem.js");
const securityInterface = require("./yesServer/securityInterface.js");
const sessionSystem = require("./yesServer/sessionSystem.js");
const mailInterface = require("./yesServer/mailInterface.js");
const passwordResetSystem = require("./yesServer/passwordResetSystem.js");

async function startUp()
{
    dbInterface.initApp();
    await accountInterface.initApp(dbInterface);
    await securityInterface.initApp();
    sessionSystem.initApp();
    await accountSystem.initApp(app, io, accountInterface, securityInterface, sessionSystem);
    await mailInterface.initApp();
    await passwordResetSystem.initApp(app, io, accountInterface, accountSystem, securityInterface, sessionSystem, mailInterface);
    basicGameSystem.initApp(app, io, accountInterface, sessionSystem);

    server.listen(80, () => {
        console.log('> Started server on *:80');
    });

    //shell.start();
}

startUp().then();
