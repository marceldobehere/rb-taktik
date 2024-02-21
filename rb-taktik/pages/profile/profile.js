const friendReqButton = document.getElementById('friend-req-button');
const challengeButton = document.getElementById('challenge-button');

const usernameSpan = document.getElementById('username');
const rankSpan = document.getElementById('rank');

let otherUserId = undefined;
let areFriends = false;
let isPending = false;

async function initProfileStuff()
{
    friendReqButton.disabled = isGuest;
    friendReqButton.textContent = "FRIEND";
    challengeButton.disabled = isGuest;

    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log("Url params:", params);
    let userid = parseInt(params["userid"]);
    otherUserId = userid;
    if (userid == undefined)
    {
        usernameSpan.textContent = "???";
        rankSpan.textContent = "???";
        friendReqButton.disabled = true;
        challengeButton.disabled = true;
        alert("Invalid user id");
        return;
    }
    console.log("Attempting to get profile for userid: ", userid);

    let profileData = await msgSendAndGetReply("get-user-info", {userId: userid});
    if (profileData["error"])
    {
        usernameSpan.textContent = "???";
        rankSpan.textContent = "???";
        friendReqButton.disabled = true;
        challengeButton.disabled = true;
        alert("Error: " + profileData["error"]);
        return;
    }
    console.log("Profile:", profileData);

    usernameSpan.textContent = profileData["username"];
    rankSpan.textContent = profileData["rank"];

    if (userid == userData.userId)
    {
        friendReqButton.disabled = true;
        challengeButton.disabled = true;
        return;
    }

    if (isGuest)
        return;


    let isFriendReply = await msgSendAndGetReply("am-friends", {userId: userid});
    if (isFriendReply["error"])
    {
        alert("Error: " + isFriendReply["error"]);
        return;
    }
    console.log("Friends:", isFriendReply);
    areFriends = isFriendReply["areFriends"];
    isPending = false;
    if (!areFriends)
    {
        let isPendingReply = await msgSendAndGetReply("am-pending", {userId: userid});
        if (isPendingReply["error"])
        {
            alert("Error: " + isPendingReply["error"]);
            return;
        }
        console.log("Pending:", isPendingReply);
        isPending = isPendingReply["isPending"];
    }

    if (areFriends)
    {
        friendReqButton.textContent = "UNFRIEND";
        challengeButton.disabled = false;
    }
    else if (isPending)
    {
        friendReqButton.textContent = "Cancel Request";
        challengeButton.disabled = true;
    }
    else
    {
        friendReqButton.textContent = "FRIEND";
        challengeButton.disabled = true;
    }
}

async function sendFriendRequest()
{
    if (areFriends)
    {
        let check = confirm("Are you sure you want to unfriend this user?");
        if (!check)
            return;

        alert('Not implemented yet!');
    }
    else if (isPending)
    {
        let check = confirm("Are you sure you want to cancel the friend request?");
        if (!check)
            return;

        alert('Not implemented yet!');
    }
    else
    {
        if (otherUserId == undefined)
            return;

        let reply = await msgSendAndGetReply("request-friend", {userId: otherUserId});
        if (reply["error"])
        {
            alert("Error: " + reply["error"]);
            return;
        }
        console.log(reply);

        await initProfileStuff();
    }
}

async function challengeUser()
{
    if (otherUserId == undefined)
        return;

    alert('Not implemented yet!');
}

onModulesImported.push(initProfileStuff);