var importList = [];
var onModulesImported = [];

// add loader div
{
    let loaderDiv = document.createElement("div");
    loaderDiv.id = "loader-div";
    loaderDiv.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;";
    document.getElementsByTagName("BODY")[0].appendChild(loaderDiv);
}

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
