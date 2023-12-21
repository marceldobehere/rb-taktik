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
       
    }
    if (settingsObj == undefined || settingsObj == null)
    {
        // Default
        settingsObj = {
        "volumeMusic": 50,
        "volumeFX": 50
    };
    }
    console.log("Settings:", settingsObj)
}

function saveSettings()
{
    localStorage.setItem("settings", JSON.stringify(settingsObj));
}

function getValue(name, output, slider){
    val = settingsObj[name];
    output.innerText = val + "%";
    if (slider)
        slider.value = val;
    return val;
}

function setValue(name, x, output){
    settingsObj[name] = x;
    saveSettings();
    getValue(name, output);
    output.innerText = x + "%";
}



getValue('volumeMusic', volumeMusic, volumeMusicValue);
getValue('volumeFX', volumeFX, volumeFXValue)
