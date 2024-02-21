let notificationList = document.getElementById("notification-list");

async function loadNotifications(data)
{

    let notificationCount = document.getElementById("notification-count");    clearNotifications();
    notificationCount.textContent = 0;

    console.log("Notifications: ", data);
    if (data["error"])
        return console.log("Error loading notifications: ", data["error"]);

    let read = data.read;
    let unread = data.unread;


    notificationCount.textContent = `${unread.length} (${read.length + unread.length})`;

    for (let i = 0; i < unread.length; i++)
        addOneNotification(unread[i], true);

    for (let i = 0; i < read.length; i++)
        addOneNotification(read[i], false);
}

function clearNotifications()
{
    notificationList.innerHTML = "";
}

function addOneNotification(not, isUnread)
{
    if (not === undefined)
        return;

    let type = not["type"];
    let elem;
    if (type == "friend-req")
        elem = createFriendReqNotification(not);
    else if (type == "friend-accept")
        elem = createNowFriendsNotification(not);
    else if (type == "friend-decline")
        elem = createNowFriendsNotification(not);
    else if (type == "friend-remove")
        elem = createNowFriendsNotification(not);
    else if (type == "match-req")
        elem = createChallengeNotification(not);
    else if (type == "msg")
        elem = createServerNotification(not);
    else
        return console.error("Unknown notification type: ", type, not);

    if (isUnread)
        elem.className += " notification-unread";
    else
        elem.className += " notification-read";
}

function createGenericMessage(title, text, hasPfp, hasButtons, notId)
{
    let topDiv = document.createElement("div");
    topDiv.className = "notification-entry";
    notificationList.appendChild(topDiv);

    let contentAndBtnDiv = document.createElement("div");
    contentAndBtnDiv.className = "flexify";
    topDiv.appendChild(contentAndBtnDiv);

    let contentDiv = document.createElement("div");
    contentDiv.className = "flexify";
    contentAndBtnDiv.appendChild(contentDiv);

    let pfpDiv = undefined;
    if (hasPfp)
    {
        pfpDiv = document.createElement("div");
        pfpDiv.className = "notify-pfp-div notify-pfp";
        contentDiv.appendChild(pfpDiv);

        let pfpImg = document.createElement("img");
        pfpImg.src = "/shared/images/placeHolderPFP.png";
        pfpImg.width = 50;
        pfpImg.height = 50;
        pfpImg.alt = "Profile Picture";
        pfpDiv.appendChild(pfpImg);
    }

    let messageDiv = document.createElement("div");
    messageDiv.className = hasPfp ? "message" : "server-message";
    contentDiv.appendChild(messageDiv);

    let messageTitleSpan = document.createElement("span");
    messageTitleSpan.className = "message-title";
    messageTitleSpan.textContent = title;
    messageDiv.appendChild(messageTitleSpan);

    let miniBr = document.createElement("br");
    messageDiv.appendChild(miniBr);

    let messageItselfSpan = document.createElement("span");
    messageItselfSpan.className = "message-itself";
    messageItselfSpan.textContent = text;
    messageDiv.appendChild(messageItselfSpan);

    let xButtonDiv = document.createElement("div");
    xButtonDiv.className = "x-button";
    contentAndBtnDiv.appendChild(xButtonDiv);

    let xButton = document.createElement("button");
    xButton.textContent = "X";
    xButton.onclick = () => {clearNotification(notId)};
    xButtonDiv.appendChild(xButton);

    let acceptBtn = undefined;
    let declineBtn = undefined;
    if (hasButtons)
    {
        let decisionBtnsDiv = document.createElement("div");
        decisionBtnsDiv.className = "decision-btns";
        topDiv.appendChild(decisionBtnsDiv);

        acceptBtn = document.createElement("button");
        acceptBtn.textContent = "ACCEPT";
        acceptBtn.onclick = () => {alert("NOT IMPLEMENTED YET!")};
        decisionBtnsDiv.appendChild(acceptBtn);

        declineBtn = document.createElement("button");
        declineBtn.textContent = "DECLINE";
        declineBtn.onclick = () => {alert("NOT IMPLEMENTED YET!")};
        decisionBtnsDiv.appendChild(declineBtn);
    }

    return {topDiv, pfpDiv, acceptBtn, declineBtn};
}

function createFriendReqNotification(not)
{
    let res = createGenericMessage(not["title"], not["text"], true, true, not["id"]);

    let acceptBtn = res["acceptBtn"];
    let declineBtn = res["declineBtn"];
    let friendId = not["from"];
    let notId = not["id"];

    acceptBtn.onclick = async () => {await acceptFriend(friendId, notId);};
    declineBtn.onclick = async () => {await declineFriend(friendId, notId);};

    return res["topDiv"];
}

function createNowFriendsNotification(not)
{
    let res = createGenericMessage(not["title"], not["text"], true, false, not["id"]);

    return res["topDiv"];
}

function createChallengeNotification(not)
{
    let res = createGenericMessage(not["title"], not["text"], true, true, not["id"]);

    return res["topDiv"];
}

function createServerNotification(not)
{
    let res = createGenericMessage(not["title"], not["text"], false, false, not["id"]);

    return res["topDiv"];
}

async function markAllNotificationsAsRead()
{
    let res = await msgSendAndGetReply("read-notifications", {});
    if (res["error"] != undefined)
    {
        alert("Error: " + res["error"]);
        return;
    }
}

async function clearNotification(notId)
{
    console.log("Clearing notification: ", notId);

    let res = await msgSendAndGetReply("clear-notification", {notificationId: notId});

    if (res["error"] != undefined)
    {
        alert("Error: " + res["error"]);
        return;
    }
}

async function notInit()
{
    msgHook('notification', loadNotifications);

    socket.emit('notification', {});
}

onModulesImported.push(notInit);