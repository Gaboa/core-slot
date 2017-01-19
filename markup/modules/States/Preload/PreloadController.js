import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Preload/PreloadView';

export class Preload {
    constructor(game) {

    }

    init() {
        const game = model.el('game');
        game.add.plugin(Fabrique.Plugins.Spine);
    }

    preload() {
        const game = model.el('game');
        game.load.setPreloadSprite(view.drawPreloadBar());
        view.drawPreloadCoin();

        this.loadSounds();
        this.loadInitAssets();
        this.loadMainAssets();
        this.loadFSAssets();
        this.loadSpineAssets();
        this.loadElements();

        game.load.onLoadComplete.add(this.hidePreloader);
    }

    loadSounds() {
        const game = model.el('game');
        game.load.path = 'static/img/content/sound/';
        game.load.audio('fon', 'ambient.mp3');
        game.load.audio('fsFon', 'fsAmbient.mp3');
        game.load.audio('initFon', 'logoAmbient.mp3');
        game.load.audio('baraban', 'baraban.mp3');
        game.load.audio('buttonClick', 'buttonClick.mp3');
        game.load.audio('startPerehod', 'startPerehod.mp3');
        game.load.audio('finishPerehod', 'finishPerehod.mp3');
        game.load.audio('lineWin', 'lineWin.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');
        game.load.audio('dragonEat', 'dragon.mp3');
        game.load.audio('dragonLaugh', 'dragonLaugh.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/mainBG.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.png');
        game.load.image('logos', 'bg/logos.png');
        game.load.image('transitionBG', 'bg/transitionBG.png');
        game.load.image('upperBG', 'bg/upperBG.png');
        game.load.image('BG', 'bg/BG.png');
        game.load.image('snow', 'bg/snow.png');
        game.load.spritesheet('snowflakes', 'bg/snow2.png', 17, 17);
        game.load.spritesheet('snowflakes_large', 'bg/snow3.png', 64, 64);
        game.load.image('wind1', 'bg/wind1.png');
        game.load.image('wind2', 'bg/wind2.png');
        game.load.image('el', 'bg/el.png');
        game.load.image('sugrob', 'bg/sugrob.png');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('skyLogo', 'game/skyLogo.png');
        game.load.image('gameLogo', 'game/gmLogo.png');
        game.load.image('gameShadow', 'game/gameShadow.png');
        game.load.image('popup', 'other/popup.png');
        game.load.image('closed', 'other/closed.png');
        game.load.image('ar', 'other/ar.png');
        game.load.image('arLeft', 'other/arLeft.png');
        game.load.atlasJSONArray('info', 'other/info.png', 'other/info.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLineRect.png');
        game.load.image('winTotal', 'win/winTotalRect.png');
        game.load.image('winTotalFS', 'win/winTotalRectFS.png');
        game.load.image('betBonus', 'win/betBonus.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('splash', 'win/splash.png', 'win/splash.json');
        game.load.image('ball', 'win/ball.png');
        game.load.atlasJSONArray('multiNumbers', 'numbers/multiNumbers.png', 'numbers/multiNumbers.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont("numbersFont", "numbers/numbers.png", "numbers/numbers.xml");
        if (model.desktop) {
            game.load.image('ui', 'game/UI.png');
            game.load.image('uiFS', 'game/UI_FS.png');
            game.load.image('convert', 'game/convert.png');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.atlasJSONArray('deskButtonsAnim', 'desk_buttons/deskButtonsAnim.png', 'desk_buttons/deskButtonsAnim.json');
            game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }
        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/mainBG.png');
        if (model.mobile) {
            game.load.image('freeSpinsBG', 'fs/freeSpinsBG.png');
            game.load.image('multiBG', 'fs/multiBG.png');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('dragon', 'spine/Dragon.json');
        game.load.spine('logo', 'spine/skeleton.json');
        game.load.spine('tree', 'spine/iolka.json');
        game.load.spine('krampus', 'spine/krampus.json');
        game.load.spine('stars', 'spine/stars.json');
        game.load.spine('deer', 'spine/oleny.json');
        game.load.spine('smoke', 'spine/smoke.json');
    }

    loadElements() {
        const game = model.el('game');
        game.load.atlasJSONArray('bg', 'elements/bg.png', 'elements/bg.json');
        game.load.atlasJSONArray('1', 'elements/1.png', 'elements/1.json');
        game.load.atlasJSONArray('2', 'elements/2.png', 'elements/2.json');
        game.load.atlasJSONArray('3', 'elements/3.png', 'elements/3.json');
        game.load.atlasJSONArray('4', 'elements/4.png', 'elements/4.json');
        game.load.atlasJSONArray('5', 'elements/5.png', 'elements/5.json');
        game.load.atlasJSONArray('6', 'elements/6.png', 'elements/6.json');
        game.load.atlasJSONArray('7', 'elements/7.png', 'elements/7.json');
        game.load.atlasJSONArray('8', 'elements/8.png', 'elements/8.json');
        game.load.atlasJSONArray('9', 'elements/9.png', 'elements/9.json');
        game.load.atlasJSONArray('10', 'elements/10.png', 'elements/10.json');
        game.load.atlasJSONArray('11', 'elements/11.png', 'elements/11.json');
    }

    hidePreloader() {
        const game = model.el('game');
        view.hideCoin();
        view.hideBar();
        if (model.state('initScreen')) {
            game.state.start('Init');
        } else {
            game.state.start('Main');
        }
    }
}
