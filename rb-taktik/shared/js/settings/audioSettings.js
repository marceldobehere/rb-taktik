var audioSettingsObj = undefined;
audioSettingsObj = loadSetting("audio");

if (!audioSettingsObj["volumeMusic"])
    audioSettingsObj["volumeMusic"] = 100;
if (!audioSettingsObj["volumeFX"])
    audioSettingsObj["volumeFX"] = 100;
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