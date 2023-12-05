const fs = require('fs');
const fsPromise = fs.promises;
const folderPath = "./localDB/";
// For now Our DB connection just writes the "tables" to files in the localDB folder
// This will be used until we hook it up to a MongoDB database


function initApp()
{

    console.log("> Initialized DB interface");
}

async function tableExists(tableName)
{
    return fs.existsSync(folderPath + tableName + ".json");
}

async function createTable(tableName) {
    if (await tableExists(tableName))
        return;

    //fs.writeFileSync(folderPath + tableName + ".json", "{}");
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
    if (! await tableExists(tableName))
        return;

    let table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    table[key] = value;
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function getPair(tableName, key)
{
    if (! await tableExists(tableName))
        return;

    let table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    return table[key];
}

async function updatePair(tableName, key, value)
{
    if (! await tableExists(tableName))
        return;

    let table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    table[key] = value;
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function deletePair(tableName, key)
{
    if (! await tableExists(tableName))
        return;

    let table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    delete table[key];
    await fsPromise.writeFile(folderPath + tableName + ".json",  JSON.stringify(table));
}

async function getAllKeys(tableName)
{
    if (! await tableExists(tableName))
        return;

    let table = JSON.parse(fs.readFileSync(folderPath + tableName + ".json", "utf8"));
    return Object.keys(table);
}

module.exports = {initApp, tableExists, createTable, deleteTable, clearTable, addPair, getPair, updatePair, deletePair, getAllKeys};