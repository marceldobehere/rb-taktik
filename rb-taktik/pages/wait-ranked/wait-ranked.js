function waitRankedInit()
{
    startBgm(bgmMenuAudio);
    if(isGuest){
        return goPage("/home");
    }

    let rankImg = document.getElementById("curr-rank");
    let rank = userData["rank"];
    // console.log(rank);

    rankImg.src = getRankImageFromLevel(rank);

}

onModulesImported.push(waitRankedInit);