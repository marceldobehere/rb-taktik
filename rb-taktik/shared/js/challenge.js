async function challengeUserFunc(userId)
{
    alert('BRUH: ' + userId);

    // check if friend


    // go to ingame, it will send a match request.
    goPage(`/ingame/ingame.html?challengeFriend=${userId}`)
}

async function acceptChallenge(userId, roomId, notificationId)
{
    //alert(`ACCEPTING MATCH FROM ${userId} -> ROOM ${roomId}, NOT: ${notificationId}`);
    let link = window.location.origin + "/ingame/ingame.html?gameid=" + roomId;
    goPage(link);
}

async function declineChallenge(userId, roomId, notificationId)
{
    alert(`DECLINING MATCH FROM ${userId} -> ROOM ${roomId}, NOT: ${notificationId}`)

    let declineReply = await msgSendAndGetReply('decline-challenge', {userId: userId, roomId: roomId});
    if (declineReply["error"])
    {
        alert("ERROR: " + declineReply["error"]);
        return;
    }
    console.log(declineReply);
}