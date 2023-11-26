function msgSend(channel, message)
{
    socket.emit(channel, message);
}

replyDict = {};

function msgHook(channel, callback)
{
    if (replyDict[channel] == undefined)
    {
        socket.on(channel, (obj) => {
            handleReply(channel, obj);
        });
        replyDict[channel] = {base: callback, callbacks: []};
    }
}


function handleReply(channel, obj)
{
    //console.log(`GOT REPLY: ${channel} ${JSON.stringify(obj)}`);
    if (replyDict[channel] != undefined)
    {
        let replyEntry = replyDict[channel];

        if (replyEntry.callbacks.length > 0)
        {
            let resolve = replyEntry.callbacks.shift();
            resolve(obj);
            return;
        }

        if (replyEntry.base != undefined)
        {
            replyEntry.base(obj);
            return;
        }

        console.log(`Unhandled reply: ${channel} ${JSON.stringify(obj)}`);
    }
}

function msgSendAndGetReply(channel, message)
{
    let replyPromise = new Promise(resolve =>
    {
        if (replyDict[channel] == undefined)
        {
            socket.on(channel, (obj) => {
                handleReply(channel, obj);
            });
            replyDict[channel] = {base: undefined, callbacks: []};
        }
        replyDict[channel].callbacks.push(resolve);
    });

    socket.emit(channel, message);
    return replyPromise;
}