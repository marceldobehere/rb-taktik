async function waitRankedInit()
{
    startBgm(bgmMenuAudio);
    if(isGuest)
        return goPage("/home");


    let rankImg = document.getElementById("curr-rank");
    let rank = userData["rank"];

    rankImg.src = getRankImageFromLevel(rank);

    msgHook('connect-match', (obj) => {
        console.log("> Match connected: ", obj);
        if (obj["host"])
            goPage("/ingame/ingame.html?matchUp=true");
    });

    msgHook('match-set-room', (data) => {
        console.log("> Match set room: ", data);
        goPage(`/ingame/ingame.html?gameid=${data["roomId"]}`);
    });

    let reply = await msgSendAndGetReply('start-wait-ranked', {});
    if (reply["error"] != undefined)
    {
        alert("Error: " + reply["error"])
        return;
    }
}

onModulesImported.push(waitRankedInit);