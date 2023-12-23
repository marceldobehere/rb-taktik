let app;
let io;
let accountSystem;
let accountInterface;
let securityInterface;
let sessionSystem;
let mailInterface;
const RB_TAKTIK_ADDRESS = "http://localhost:80";

let passwordResetRequests = {};

async function initApp(_app, _io, _accountInterface, _accountSystem, _securityInterface, _sessionSystem, _mailInterface) {
    app = _app;
    io = _io;
    accountInterface = _accountInterface;
    accountSystem = _accountSystem;
    securityInterface = _securityInterface;
    sessionSystem = _sessionSystem;
    mailInterface = _mailInterface;

    io.on('connection', (socket) => {
        socket.on('password-reset-request', async (obj) => {
            removeOldResets();

            let email = obj.email;
            let username = obj.username;

            let user = await accountInterface.getUserByUsername(username);
            if (user == undefined)
                return socket.emit('password-reset-request', {error: "Invalid username"});

            if (user.email != email)
                return socket.emit('password-reset-request', {error: "Invalid email"});

            let resetId = securityInterface.getRandomInt(1000000000, 9999999999);
            passwordResetRequests[resetId] = {
                username: username,
                email: email,
                resetId: resetId,
                createdAt: Date.now()
            };

            // Send mail
            // TODO: TEST + make the reset link work
            let mailRes = await mailInterface.sendMail(
                email,
                "Password reset",
                "A password reset was requested for your account.",
                "<h1>Password reset</h1><p>A password reset was requested for your account. If you did not request this, please ignore this email.</p><p><a href='" + RB_TAKTIK_ADDRESS + "/password-reset/password-reset.html?resetId=" + resetId + "'>Click here to reset your password</a></p>");

            if (!mailRes)
                return socket.emit('password-reset-request', {error: "Failed to send mail"});

            socket.emit('password-reset-request', {success: true});
        });

        socket.on('password-reset-verify', async (obj) => {
            removeOldResets();

            let resetId = obj.resetId;
            let newPassword = obj.newPassword;

            if (passwordResetRequests[resetId] == undefined)
                return socket.emit('password-reset-verify', {error: "Invalid reset id"});

            let user = await accountInterface.getUserByUsername(passwordResetRequests[resetId].username);
            delete passwordResetRequests[resetId];
            if (user == undefined)
                return socket.emit('password-reset-verify', {error: "Invalid username"});

            let res = await accountSystem.changeUserPassword(user.userId, newPassword);
            if (!res)
                return socket.emit('password-reset-verify', {error: "Failed to change password"});

            socket.emit('password-reset-verify', {success: true});
        });
    });
}

function removeOldResets()
{
    // remove all older than 1 hour
    let now = Date.now();

    for (let key in passwordResetRequests)
        if (now - passwordResetRequests[key].createdAt > 1000 * 60 * 60)
            delete passwordResetRequests[key];
}


module.exports = {initApp};