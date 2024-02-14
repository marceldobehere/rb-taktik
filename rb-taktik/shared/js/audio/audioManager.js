function initAudio(){
    const bgmAudio = new Audio();
   
    const fxAudioDraw = new Audio();
    const fxAudiogameStartCountdown = new Audio();
    const fxAudioGameStart= new Audio();
    const fxAudioLose= new Audio();
    const fxAudioMenuButtonClick= new Audio();
    const fxAudioMenuButtonHover= new Audio();
    const fxAudioNewScore = new Audio();
    const fxAudioNoRB234Left = new Audio();
    const fxAudioplace = new Audio();
    const fxAudioWin = new Audio();

    const bgm1 = "../../audio/music/rb_taktik_ingame_1.mp3";
    const bgm2 = "../../audio/music/rb_taktik_ingame_2.mp3";
    const menuMusic = "../../audio/music/rb_taktik_main_menu.mp3";

    const draw = "../../audio/fx/draw.mp3";
    const gameStartCountdown = "../../audio/fx/game_start_countdown.mp3";
    const gameStart = "../../audio/fx/game_start.mp3";
    const lose = "../../audio/fx/lose.mp3";
    const menuButtonClick = "../../audio/fx/menu_button_click.mp3";
    const menuButtonHover = "../../audio/fx/menu_button_hover.mp3";
    const newScore = "../../audio/fx/new_score.mp3";
    const noRB234Left = "../../audio/fx/no_rb234_left.mp3";
    const place = "../../audio/fx/place.mp3";
    const win = "../../audio/fx/win.mp3";


}

onModulesImported.push(initAudio);