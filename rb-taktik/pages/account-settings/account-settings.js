function copyProfileLink()
{
    if (isGuest)
        return;

    let link = window.location.origin + "/profile/profile.html?userid=" + userData["userId"];
    prompt("Please copy the following link:", link);
}