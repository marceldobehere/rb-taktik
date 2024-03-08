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
    updateAudioVol();
}


onModulesImported.push(() => {
    getValue('volumeMusic', volumeMusic, volumeMusicValue);
    getValue('volumeFX', volumeFX, volumeFXValue);
});

startBgm(bgmMenuAudio);

const btns = document.querySelectorAll(".sound");

btns.forEach(function(btn) {
  let hoverSoundPlayed = false;

  btn.addEventListener("click", function() {
    fxAudioMenuButtonClick.play()
      .then(() => {
        console.log("fx played");
      })
      .catch(() => {
        // console.error("error");
      });
  });

  btn.addEventListener("mouseover", function() {
    if (!hoverSoundPlayed) {
      fxAudioMenuButtonHover.volume = 0.25;
      fxAudioMenuButtonHover.play()
        .then(() => {
          console.log("hover sound played");
        })
        .catch(() => {
        //   console.error("error");
        });
      hoverSoundPlayed = true;
    }
  });

  btn.addEventListener("mouseout", function(event) {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || (relatedTarget !== btn && !btn.contains(relatedTarget))) {
      hoverSoundPlayed = false;
    }
  });
});
