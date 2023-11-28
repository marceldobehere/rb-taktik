var socket;
importModule("/socket.io/socket.io.js", () =>
{
    socket = io();
    console.log("> Global Socket Loaded");
});
