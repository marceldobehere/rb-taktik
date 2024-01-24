function getValue(name, output, slider){
    val = loadAudioSetting(name);
    output.innerText = val + "%";
    if (slider)
        slider.value = val;
    return val;
}

function setValue(name, x, output){
    saveAudioSetting(name, x);
    getValue(name, output);
    output.innerText = x + "%";
}


onModulesImported.push(() => {
    getValue('volumeMusic', volumeMusic, volumeMusicValue);
    getValue('volumeFX', volumeFX, volumeFXValue);
});