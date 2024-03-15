async function waitRandomInit()
{
    startBgm(bgmMenuAudio);
    if(isGuest)
        return goPage("/home");

    msgHook('connect-match', (obj) => {
        console.log("> Match connected: ", obj);
        if (obj["host"])
            goPage("/ingame/ingame.html?matchUp=true");
    });

    msgHook('match-set-room', (data) => {
        console.log("> Match set room: ", data);
        goPage(`/ingame/ingame.html?gameid=${data["roomId"]}`);
    });

    let reply = await msgSendAndGetReply('start-wait-random', {});
    if (reply["error"] != undefined)
    {
        alert("Error: " + reply["error"])
        return;
    }
}

onModulesImported.push(waitRandomInit);