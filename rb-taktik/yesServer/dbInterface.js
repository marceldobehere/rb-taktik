const fs = require('fs');
const fsPromise = fs.promises;
const folderPath = "./localDb/";
// For now Our DB connection just writes the "tables" to files in the localDb folder
// This will be used until we hook it up to a MongoDB database


function initApp()
{
    if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath);

    console.log("> Initialized db interface");
}

async function _getTable(tableName)
{
    if (! await tableExists(tableName))
        return;

    let table = {};
    try
    {
        table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    }
    catch (e)
    {
        console.error("> ERROR READING DB:");
        console.error(e);
        console.error(`File Data: \"${fs.readFileSync(folderPath + tableName + ".json", "utf8")}\"`);
    }

    return table;
}

async function tableExists(tableName)
{
    return fs.existsSync(folderPath + tableName + ".json");
}

async function createTable(tableName) {
    if (await tableExists(tableName))
        return;

    await fsPromise.writeFile(folderPath + tableName + ".json", "{}");
}

async function deleteTable(tableName)
{
    if (! await tableExists(tableName))
        return;

    fs.unlinkSync(folderPath + tableName + ".json");
}

async function clearTable(tableName)
{
    if (! await tableExists(tableName))
        return;

    await fsPromise.writeFile(folderPath + tableName + ".json", "{}");
}

async function addPair(tableName, key, value)
{
    let table = await _getTable(tableName);
    if (!table)
        return;

    table[key] = value;
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function getPair(tableName, key)
{
    let table = await _getTable(tableName);
    if (!table)
        return undefined;

    return table[key];
}

async function updatePair(tableName, key, value)
{
    let table = await _getTable(tableName);
    if (!table)
        return;

    table[key] = value;
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function deletePair(tableName, key)
{
    let table = await _getTable(tableName);
    if (!table)
        return;

    delete table[key];
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function getAllKeys(tableName)
{
    let table = await _getTable(tableName);
    if (!table)
        return [];

    return Object.keys(table);
}

module.exports = {initApp, tableExists, createTable, deleteTable, clearTable, addPair, getPair, updatePair, deletePair, getAllKeys};