const bgm1Audio = new Audio();
const bgm2Audio = new Audio();
const bgmMenuAudio = new Audio();

const fxAudioDraw = new Audio();
const fxAudiogameStartCountdown = new Audio();
const fxAudioGameStart = new Audio();
const fxAudioLose = new Audio();
const fxAudioMenuButtonClick = new Audio();
const fxAudioMenuButtonHover = new Audio();
const fxAudioNewScore = new Audio();
const fxAudioNoRB234Left = new Audio();
const fxAudioplace = new Audio();
const fxAudioWin = new Audio();

function initAudio() {
    const bgm1 = "/shared/audio/music/rb_taktik_ingame_1.mp3";
    const bgm2 = "/shared/audio/music/rb_taktik_ingame_2.mp3";
    const menuMusic = "/shared/audio/music/rb_taktik_main_menu.mp3";

    const draw = "/shared/audio/fx/draw.mp3";
    const gameStartCountdown = "/shared/audio/fx/game_start_countdown.mp3";
    const gameStart = "/shared/audio/fx/game_start.mp3";
    const lose = "/shared/audio/fx/lose.mp3";
    const menuButtonClick = "/shared/audio/fx/menu_button_click.mp3";
    const menuButtonHover = "/shared/audio/fx/menu_button_hover.mp3";
    const newScore = "/shared/audio/fx/new_score.mp3";
    const noRB234Left = "/shared/audio/fx/no_rb234_left.mp3";
    const place = "/shared/audio/fx/place.mp3";
    const win = "/shared/audio/fx/win.mp3";
            
    bgm1Audio.src = bgm1;
    bgm2Audio.src = bgm2;
    bgmMenuAudio.src = menuMusic;


    fxAudioDraw.src = draw;
    fxAudiogameStartCountdown.src = gameStartCountdown;
    fxAudioGameStart.src = gameStart;
    fxAudioLose.src = lose;
    fxAudioMenuButtonClick.src = menuButtonClick;
    fxAudioMenuButtonHover.src = menuButtonHover;
    fxAudioNewScore.src = newScore;
    fxAudioNoRB234Left.src = noRB234Left;
    fxAudioplace.src = place;
    fxAudioWin.src = win;

    console.log("> Audio Init done!")

}

function startBgm(audio)
{
    setInterval(() => {
        bgmStarter(audio);
    }, 200);
}

async function bgmStarter(audioElement)
{
    if (audioElement.paused)
    {
        try {
            await audioElement.play();
        } catch (e)
        {
            //console.log("BRUH", e)
        }
    }
}

onModulesImported.push(initAudio);