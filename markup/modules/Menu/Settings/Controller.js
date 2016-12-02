import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view } from 'modules/Menu/Settings/View';
import { view as mainView } from 'modules/States/Main/View';

import { controller as soundController } from 'modules/Sound/Controller';

export let controller = (() => {

    let game;
    let touchX = 0;

    let handle = {
        _touchEnd: function () {
            document.removeEventListener('touchend', handle._touchEnd, false);
            if (touchX + 100 < game.input.mouse.input.x) {
                handle.switchRulesLeft();
            } else
            if (touchX - 100 > game.input.mouse.input.x) {
                handle.switchRulesRight();
            }
        },
        touchRules: function () {
            touchX = game.input.mouse.input.x;

            document.addEventListener("touchend", handle._touchEnd, false);
        },
        openSettings: function () {
            if(model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')
            || model.state('settings') === 'open') return;

            model.state('settings', 'open');
            view.show.Settings({});
            view.show.Overlay({});
        },
        closeSettings: function () {
            if (model.state('settings') === 'close') return;

            soundController.sounds.button.play();
            if (model.state('settings') === 'rules') {
                view.hide.Rules({});
            }
            if (model.state('settings') === 'open') {
                view.hide.Settings({});
            }

            view.hide.Overlay({});
            model.state('settings', 'close');
        },
        handMode: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');
            const time = 700;

            view.hide.Settings({});
            view.hide.Overlay({});

            const mainContainer = model.group('main');
            const mask = model.el('mask');
            let xSide;
            if (model.state('gameSideLeft')) {
                model.state('gameSideLeft', false);
                model.el('settingsHandModeButton').frameName = 'handModeOn.png';

                xSide = model.data('buttonsXLeft');
                game.add.tween(mainContainer).to( { x: model.data('mainXRight') }, time, 'Quart.easeOut', true);
                game.add.tween(mask).to( { x: model.data('mainXRight') - model.data('mainXLeft') }, time, 'Quart.easeOut', true);
            } else {
                model.state('gameSideLeft', true);
                model.el('settingsHandModeButton').frameName = 'handModeOff.png';

                xSide = model.data('buttonsXRight');
                game.add.tween(mainContainer).to( { x: model.data('mainXLeft') }, time, 'Quart.easeOut', true);
                game.add.tween(mask).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
            // Change Side Buttons
            let spinButton = model.el('spinButton');
            let autoButton = model.el('autoButton');
            let betButton = model.el('betButton');
            let menuButton = model.el('menuButton');
            let soundButton = model.el('soundButton');

            spinButton.x = xSide;
            autoButton.x = xSide;
            betButton.x = xSide;
            menuButton.x = xSide;
            soundButton.x = xSide;
        },
        changeSound: function () {
            let menuButtonSound = model.el('soundButton');
            let soundButton = model.el('settingsSoundButton');

            if (soundController.isSound) {
                soundButton.frameName = 'soundOff.png';
                soundController.isSound = false;
                if (!soundController.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                soundButton.frameName = 'soundOn.png';
                soundController.isSound = true;
                menuButtonSound.frameName = 'sound.png';
                soundController.sounds.button.play();
            }
        },
        changeMusic: function () {
            let menuButtonSound = model.el('soundButton');
            let musicButton = model.el('settingsMusicButton');

            soundController.sounds.button.play();
            if (soundController.isMusic) {
                musicButton.frameName = 'musicOff.png';
                soundController.isMusic = false;
                if (!soundController.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                musicButton.frameName = 'musicOn.png';
                soundController.isMusic = true;
                menuButtonSound.frameName = 'sound.png';
            }
        },
        changeFastSpin: function () {
            let fastSpinButton = model.el('settingsFastSpinButton');
            soundController.sounds.button.play();
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        },
        openRules: function () {
            if (model.state('settings') === 'rules') return;

            model.state('settings', 'rules');
            view.hide.Settings({});
            view.show.Rules({});
            let counter = 0;
            model.el('infoCounter', counter);
        },
        closeRules: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');
            view.hide.Rules({});
            view.hide.Overlay({});
            let counter = model.el('infoCounter');
            counter = 0;
            model.el('infoCounter', counter);
        },
        switchRulesRight: function () {
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter > config.numOfInfoDots - 2) {
                counter = 0;
            } else {
                counter++;
            }
            infoMarkers[counter].frameName = 'marker_on.png';

            let infoRules = model.el('infoRules');
            infoRules.frameName = counter + 1 + '_en.png';
            model.el('infoCounter', counter);
        },
        switchRulesLeft: function () {
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter < 1) {
                counter = config.numOfInfoDots - 1;
            } else {
                counter--;
                infoMarkers[counter + 1].frameName = 'marker_off.png';
            }
            infoMarkers[counter].frameName = 'marker_on.png';

            let infoRules = model.el('infoRules');
            infoRules.frameName = counter + 1 + '_en.png';
            model.el('infoCounter', counter);
        },
        showHistory: function () {
            soundController.sounds.button.play();
        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 10;
            overlay.events.onInputDown.add(handle.closeSettings);

        view.draw.Container({});

        let bg = view.draw.BG({});
            bg.inputEnabled = true;
            bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        let soundButton = view.draw.SoundButton({});
            soundButton.inputEnabled = true;
            soundButton.input.priorityID = 12;
            soundButton.events.onInputDown.add(handle.changeSound);
        view.draw.SoundButtonText({});

        let musicButton = view.draw.MusicButton({});
            musicButton.inputEnabled = true;
            musicButton.input.priorityID = 12;
            musicButton.events.onInputDown.add(handle.changeMusic);
        view.draw.MusicButtonText({});

        let fastSpinButton = view.draw.FastSpinButton({});
            fastSpinButton.inputEnabled = true;
            fastSpinButton.input.priorityID = 12;
            fastSpinButton.events.onInputDown.add(handle.changeFastSpin);
        view.draw.FastSpinButtonText({});

        let handModeButton = view.draw.HandModeButton({});
            handModeButton.inputEnabled = true;
            handModeButton.input.priorityID = 12;
            handModeButton.events.onInputDown.add(handle.handMode);
        view.draw.HandModeButtonText({});

        let rulesButton = view.draw.RulesButton({});
            rulesButton.inputEnabled = true;
            rulesButton.input.priorityID = 12;
            rulesButton.events.onInputDown.add(handle.openRules);
        view.draw.RulesButtonText({});

        let historyButton = view.draw.HistoryButton({});
            historyButton.inputEnabled = true;
            historyButton.input.priorityID = 12;
            historyButton.events.onInputDown.add(handle.showHistory);
        view.draw.HistoryButtonText({});

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.closeSettings);


        let infoContainer = game.add.group();
        model.group('info', infoContainer);
        view.draw.RulesScreen(infoContainer);

        let infoRules = model.el('infoRules');
        let closed = model.el('closed');
        let arrowRight = model.el('arrowRight');
        let arrowLeft = model.el('arrowLeft');
        let infoMarkers = model.el('infoMarkers');
        let counter = 0;

        infoRules.inputEnabled = true;
        closed.inputEnabled = true;
        arrowRight.inputEnabled = true;
        arrowLeft.inputEnabled = true;

        infoRules.input.priorityID = 11;
        closed.input.priorityID = 12;
        arrowRight.input.priorityID = 12;
        arrowLeft.input.priorityID = 12;

        infoRules.events.onInputDown.add(handle.touchRules);
        closed.events.onInputDown.add(handle.closeRules);
        arrowRight.events.onInputDown.add(handle.switchRulesRight);
        arrowLeft.events.onInputDown.add(handle.switchRulesLeft);

        model.state('settings', 'close');
    }

    return {
        init,
        handle
    };
})();