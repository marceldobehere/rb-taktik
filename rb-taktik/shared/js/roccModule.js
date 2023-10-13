var importList = [];
var onModulesImported = [];

async function actuallyDoNextImport()
{
    if (importList.length < 1)
    {
        console.log("RoMoI> All modules imported.");
        //console.log(`Executing funcs:`);
        //console.log(onModulesImported);
        for (let func of onModulesImported)
            await func();
        onModulesImported = [];

        // hide bg
        document.getElementsByTagName("BODY")[0].style.display = "";
        let temp = document.getElementById("loader-div");
        if (temp)
            temp.remove();
        return;
    }
    //console.log(`Importing module: ${importList[0]["path"]} ${(importList[0]["callback"] != undefined) ? (importList[0]["callback"]) : ""}`);
    let tObj = importList.shift();
    let path = tObj['path'];
    let cb = tObj['callback'];

    let tCopy = importList;
    importList = [];

    let script = document.createElement('script');
    script.src = path;
    script.onload = () => {
        if (cb != undefined)
            cb();
        importList = importList.concat(tCopy);
        actuallyDoNextImport();
    };
    script.onerror = () => {
        console.log(`RoMoI> Failed to import module: ${path}!`);
        if (cb != undefined)
            cb();
        importList = importList.concat(tCopy);
        actuallyDoNextImport();
    };
    document.body.appendChild(script);
}

async function startImporting()
{
    console.log("RoMoI> Starting Rocc Module Import...");
    await actuallyDoNextImport();
}
function importModule(path, callback) {importList.push({path:path, callback:callback});}
