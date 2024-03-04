const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require("fs");


// if /data folder doesnt exist, create it
if (!fs.existsSync(__dirname + "/data"))
{
    fs.mkdirSync(__dirname + "/data");
}

let USE_HTTPS = false;

if (process.argv[2] && process.argv[2] === '-https')
    USE_HTTPS = true;
else
    USE_HTTPS = false;


if (USE_HTTPS && !fs.existsSync(__dirname + "/data/ssl"))
{
    console.log("SSL FOLDER DOESNT EXIST");
    console.log("> Either host the server using http (set USE_HTTPS to false) or create the ssl keys.");
    console.log();
    console.log("To create the ssl keys, open a terminal in the data folder and run the following commands:");
    console.log("mkdir ssl");
    console.log("cd ssl");
    console.log("openssl genrsa -out key.pem");
    console.log("openssl req -new -key key.pem -out csr.pem");
    console.log("openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem");
    return;
}

var server;
if (!USE_HTTPS)
    server = http.createServer(app);
else
    server = https.createServer(
        {
            key: fs.readFileSync(__dirname + "/data/ssl/key.pem"),
            cert: fs.readFileSync(__dirname + "/data/ssl/cert.pem"),
        },
        app);

const { Server } = require("socket.io");
const io = new Server(server);

io.setMaxListeners(1000);


app.get('/', (req, res) => {
    res.redirect('/index/index.html');
});

app.get('/*', (req, res) => {
    let url = req.url;
    url = decodeURI(url);
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

    //console.log("URL: " + __dirname + url);

    if (url.indexOf(".") != -1 && !fs.existsSync(__dirname + url))
        res.redirect('/404/404.html');
    else
        res.sendFile(__dirname + url);
});



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
const challengeSystem = require("./yesServer/challengeSystem.js");
const rankingSystem = require("./yesServer/rankingSystem.js");


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
    basicGameSystem.initApp(app, io, accountInterface, sessionSystem, rankingSystem);
    notificationSystem.initApp(app, io, notificationInterface, accountInterface, sessionSystem);
    friendSystem.initApp(app, io, notificationSystem, friendInterface, accountInterface, sessionSystem);
    challengeSystem.initApp(app, io, notificationSystem, friendInterface, accountInterface, sessionSystem);
    await rankingSystem.initApp(accountInterface, sessionSystem);

    let port = USE_HTTPS ? 443 : 80;
    server.listen(port, () => {
        console.log('> Started server on *:'+port);
    });

    //shell.start();
}

startUp().then();
