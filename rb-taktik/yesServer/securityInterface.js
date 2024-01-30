const crypto = require("crypto");
const promisify = require("util").promisify;
const pbkdf2 = promisify(crypto.pbkdf2);

const iterations = 100000;

async function hashPassword(password) {
    let salt = crypto.randomBytes(64).toString('base64');
    let hash = await pbkdf2(password, salt, iterations, 64, 'sha512');
    hash = hash.toString('base64');

    return {
        salt: salt,
        hash: hash
    };
}

async function checkPassword(password, salt, hash) {
    let newHash = await pbkdf2(password, salt, iterations, 64, 'sha512');
    newHash = newHash.toString('base64');

    return newHash === hash;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function initApp()
{
    let hash1 = await hashPassword("bruh");
    if(await checkPassword("bruh", hash1.salt, hash1.hash))
    {
        console.log(" > Password hashing is working!");
    }
    else
    {
        console.log(" > ERROR: Password hashing is not working!");
        process.exit();
    }

    console.log("> Initialized security interface");
}

module.exports = {initApp, hashPassword, checkPassword, getRandomInt};