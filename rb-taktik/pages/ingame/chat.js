/*
<ul id="chat-list">
    <li><span class="chat-red">Red</span>: Blub 123</li>
    <li><span class="chat-blue">Blue</span>: Blub 123456</li>
    <li><span class="chat-red">Red</span>: Blub 123</li>
    <li><span class="chat-blue">Blue</span>: Blub 123456</li>
</ul>
<input id="chat-input" placeholder="Enter Chat message here">
*/

let chatList = document.getElementById("chat-list");
let chatInput = document.getElementById("chat-input");

function clearChat()
{
    chatList.innerHTML = "";
    chatInput.value = "";
}

function addMessage(username, col, message)
{
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.className = "chat-" + col;
    span.textContent = username;
    li.appendChild(span);
    li.appendChild(document.createTextNode(": " + message));
    chatList.appendChild(li);

    chatList.scrollTop = chatList.scrollHeight;
}

function InitChat()
{
    clearChat();
    attachOnEnterHandler(chatInput, async () => {
        let msg = chatInput.value;
        if (msg == "") return;
        chatInput.value = "";

        console.log("Sending chat message: " + msg);
        let res = await msgSendAndGetReply("chat-message", {"message":msg});
        if (res["error"] != undefined)
        {
            alert("Error: " + res["error"]);
            return;
        }
    });
}


onModulesImported.push(InitChat);