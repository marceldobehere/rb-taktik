async function waitRandomInit()
{
    startBgm(bgmMenuAudio);

    msgHook('connect-match', (obj) => {
        console.log("Match connected: ", obj);
    });

    let reply = await msgSendAndGetReply('start-wait-random', {});
    if (reply["error"] != undefined)
    {
        alert("Error: " + reply["error"])
        return;
    }

    console.log(reply);
}

onModulesImported.push(waitRandomInit);