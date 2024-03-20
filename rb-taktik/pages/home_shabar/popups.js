function cancelClose(event)
{
    event.stopPropagation();
}

function toggleDropDown(event) {
    let dropdownContent = document.getElementById("dropdown").querySelector(".dropdown-content");
    dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    cancelClose(event);
}

function toggleNotifications(event) {
    let dropdownContent = document.getElementById("dropdown-notify").querySelector(".dropdown-notify-content");

    if (dropdownContent.style.display === "flex")
        markAllNotificationsAsRead().then();


    dropdownContent.style.display = (dropdownContent.style.display === "flex") ? "none" : "flex";

    cancelClose(event);
}

function hideDropDownNotification()
{
    let dropdownContent = document.getElementById("dropdown-notify").querySelector(".dropdown-notify-content");
    if (dropdownContent.style.display === "flex")
        markAllNotificationsAsRead().then();
    dropdownContent.style.display = "none";
}

function hideDropDown()
{
    let dropdownContent = document.getElementById("dropdown").querySelector(".dropdown-content");
    dropdownContent.style.display = "none";
}

function disableBtn(id)
{
    let btn = document.getElementById(id);
    btn.onclick = undefined;
    btn.className = "menu-tile menu-tile-disabled drop-shadow-figma";
}