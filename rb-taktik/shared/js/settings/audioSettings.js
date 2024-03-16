var audioSettingsObj = undefined;
audioSettingsObj = loadSetting("audio");

if (!audioSettingsObj["volumeMusic"])
    audioSettingsObj["volumeMusic"] = 4;
if (!audioSettingsObj["volumeFX"])
    audioSettingsObj["volumeFX"] = 5;
saveSetting("audio", audioSettingsObj);

function loadAudioSetting(settingName)
{
    return audioSettingsObj[settingName];
}

function saveAudioSetting(settingName, setting)
{
    audioSettingsObj[settingName] = setting;
    saveSetting("audio", audioSettingsObj);
}