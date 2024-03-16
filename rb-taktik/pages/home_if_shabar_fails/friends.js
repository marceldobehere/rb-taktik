async function loadFriendList()
{
    let friendListContainer = document.getElementById('actual-friend-list');
    friendListContainer.innerHTML = "";
    if (isGuest)
        return;

    let result = await msgSendAndGetReply("get-friends", {"sessionId": sessionId});
    if (result["error"] != undefined)
    {
        alert("Error: " + result["error"])
        return;
    }

    let friends = result["friends"];
    if (friends === undefined)
        return;

    for (let friendId of friends)
    {
        let result = await msgSendAndGetReply("get-user-info", {"userId":friendId});
        if (result["error"] != undefined)
        {
            alert("Error: " + result["error"]);
            return;
        }

        let friendDiv = document.createElement("div");
        friendDiv.className = "friend";
        friendListContainer.appendChild(friendDiv);

        let friendPfp = document.createElement("div");
        friendPfp.className = "friend_pfp";
        friendDiv.appendChild(friendPfp);

        friendPfp.addEventListener("click", function() {
            //window.location.href = "http://localhost/profile/profile.html?userid=" + friendId;
            window.open("http://localhost/profile/profile.html?userid=" + friendId, '_blank').focus();
        });



        let friendPfpImg = document.createElement("img");
        friendPfpImg.src = "/shared/images/placeHolderPFP.png";
        friendPfpImg.className="pfp-image"
        friendPfpImg.width = 50;
        friendPfpImg.height = 50;
        friendPfpImg.alt = "Profile Picture";
        friendPfp.appendChild(friendPfpImg);

        
        let friendPfpDiv = document.createElement("div");
        friendPfpDiv.className = "viewProfileDiv";
        friendPfpDiv.textContent = "View Profile";
        friendPfp.appendChild(friendPfpDiv);


        // let viewProfile = document.createElement("span");
        // viewProfile.innerHTML = "View<br>Profile";
        // viewProfile.className = "viewProfile";
        // let imgPosition = friendPfpImg.getBoundingClientRect();
        // viewProfile.style.position = 'absolute';
        // viewProfile.style.top = imgPosition.top + 'px';
        // viewProfile.style.left = imgPosition.left + 'px';

        // friendPfp.appendChild(viewProfile);

        // friendPfp.addEventListener('mouseover', function() {
        //     viewProfile.style.display = 'flex';
        //     viewProfile.style.justifyContent = 'center';
        //     viewProfile.style.alignItems = 'center';
        // });

        // friendPfp.addEventListener('mouseout', function() {
        //     viewProfile.style.display = 'none';
        // });



        let friendUsername = document.createElement("div");
        friendUsername.className = "friend_username";
        friendDiv.appendChild(friendUsername);

        let friendUsernameSpan = document.createElement("span");
        friendUsernameSpan.textContent = result["username"];
        friendUsername.appendChild(friendUsernameSpan);

        let friendChallengeButton = document.createElement("div");
        friendChallengeButton.className = "challengeButton";
        friendDiv.appendChild(friendChallengeButton);

        let friendChallengeButtonBtn = document.createElement("button");
        friendChallengeButtonBtn.textContent = "Challenge";
        friendChallengeButtonBtn.onclick = () => {sendFriendChallenge(friendId)};
        friendChallengeButton.appendChild(friendChallengeButtonBtn);



    }
}

async function sendFriendChallenge(friendId)
{
    await challengeUserFunc(friendId);
}

async function acceptFriend(friendId, notId)
{
    let reply = await msgSendAndGetReply("accept-friend", {"userId": friendId});

    if (reply["error"] != undefined)
    {
        alert("Error: " + reply["error"]);
        return;
    }

    await loadFriendList();
    await clearNotification(notId);
}

async function declineFriend(friendId, notId)
{
    let reply = await msgSendAndGetReply("decline-friend", {"userId": friendId});

    if (reply["error"] != undefined)
    {
        alert("Error: " + reply["error"]);
        return;
    }

    await loadFriendList();
    await clearNotification(notId);
}

