let dbInterface;

class AsyncLock {
    constructor () {
        this.disable = () => {}
        this.promise = Promise.resolve()
    }

    enable () {
        this.promise = new Promise(resolve => this.disable = resolve)
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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
    await lock.promise
    lock.enable();
    res = false;
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