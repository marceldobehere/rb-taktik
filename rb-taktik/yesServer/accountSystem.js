let app;
let io;
let accountInterface;

function initApp(_app, _io, _accountInterface)
{
    app = _app;
    io = _io;
    accountInterface = _accountInterface;


    io.on('connection', (socket) => {

    });


    console.log("> Initialized account system");
}

module.exports = {initApp};