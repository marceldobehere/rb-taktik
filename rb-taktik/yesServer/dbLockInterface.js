let dbInterface;

class AsyncLock {
    constructor () {
        this.promiseArr = [];
        this.resolveArr = [];
    }

    disable ()
    {
        if (this.resolveArr.length > 0)
        {
            console.log("Disabling lock");

            this.promiseArr.shift();
            this.resolveArr.shift()();
        }
        else
            alert("Invalid lock disable")
    }

    async enable ()
    {
        console.log("Enabling lock");

        let tempPromises = [];
        for (let prom of this.promiseArr)
            tempPromises.push(prom);
        let bigPromise = Promise.all(tempPromises);

        let resolve;
        let promise = new Promise(r => resolve = r);
        this.promiseArr.push(promise);
        this.resolveArr.push(resolve);

        await bigPromise;
    }
}
const lock = new AsyncLock();

async function initApp(_dbInterface)
{
    dbInterface = _dbInterface;
    await dbInterface.initApp();
    console.log("> Initialized db lock interface");
}


async function tableExists(tableName)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.tableExists(tableName);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function createTable(tableName)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.createTable(tableName);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function deleteTable(tableName)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.deleteTable(tableName);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function clearTable(tableName)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.clearTable(tableName);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function addPair(tableName, key, value)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.addPair(tableName, key, value);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function getPair(tableName, key)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.getPair(tableName, key);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function updatePair(tableName, key, value)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.updatePair(tableName, key, value);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function deletePair(tableName, key)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.deletePair(tableName, key);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

async function getAllKeys(tableName)
{
    await lock.enable();
    let res = false;
    try {
        res = await dbInterface.getAllKeys(tableName);
    }
    catch (e)
    {
        console.error("> ERROR IN DB:", e);
    }
    lock.disable();
    return res;
}

module.exports = {initApp, tableExists, createTable, deleteTable, clearTable, addPair, getPair, updatePair, deletePair, getAllKeys};

