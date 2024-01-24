var settingsObj = undefined;
loadSettings();

function loadSettings()
{
    try
    {
        settingsObj = JSON.parse(localStorage.getItem("settings"));
    }
    catch (e)
    {
        console.log("Error loading settings: " + e);
    }
    if (settingsObj == undefined || settingsObj == null)
    {
        settingsObj = {};
        saveSettings();
    }
    console.log("Settings:", settingsObj)
}

function saveSettings()
{
    localStorage.setItem("settings", JSON.stringify(settingsObj));
}

function loadSetting(settingName)
{
    let res = settingsObj[settingName];
    if (res == undefined || res == null) {
        res = {};
        saveSetting(settingName, res);
    }
    return res;
}

function saveSetting(settingName, setting)
{
    settingsObj[settingName] = setting;
    saveSettings();
}