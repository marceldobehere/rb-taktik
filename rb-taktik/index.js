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



const fs = require("fs");

const internalDbInterface = require("./yesServer/dbInterface.js");
const dbInterface = require("./yesServer/dbLockInterface.js");
const accountInterface = require("./yesServer/accountInterface.js");
const accountSystem = require("./yesServer/accountSystem.js");
const basicGameSystem = require("./yesServer/basicGameSystem.js");
const securityInterface = require("./yesServer/securityInterface.js");
const sessionSystem = require("./yesServer/sessionSystem.js");
const mailInterface = require("./yesServer/mailInterface.js");
const passwordResetSystem = require("./yesServer/passwordResetSystem.js");
const notificationInterface = require("./yesServer/notificationInterface.js");
const notificationSystem = require("./yesServer/notificationSystem.js");
const friendInterface = require("./yesServer/friendInterface.js");
const friendSystem = require("./yesServer/friendSystem.js");


async function startUp()
{
    await internalDbInterface.initApp();
    await dbInterface.initApp(internalDbInterface);
    await accountInterface.initApp(dbInterface);
    await securityInterface.initApp();
    await notificationInterface.initApp(dbInterface, accountInterface, securityInterface);
    await friendInterface.initApp(dbInterface, notificationInterface, accountInterface, securityInterface);
    sessionSystem.initApp();
    await accountSystem.initApp(app, io, accountInterface, securityInterface, sessionSystem);
    await mailInterface.initApp();
    await passwordResetSystem.initApp(app, io, accountInterface, accountSystem, securityInterface, sessionSystem, mailInterface);
    basicGameSystem.initApp(app, io, accountInterface, sessionSystem);
    notificationSystem.initApp(app, io, notificationInterface, accountInterface, sessionSystem);
    friendSystem.initApp(app, io, notificationSystem, friendInterface, accountInterface, sessionSystem);

    server.listen(80, () => {
        console.log('> Started server on *:80');
    });

    //shell.start();
}

startUp().then();
