import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Panel/PanelView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as rollController } from 'modules/Roll/RollController';

export let controller = (() => {

    function drawButtons() {
        view.draw.PanelBG({});
        // view.draw.LinesNumber({});
        view.draw.AutoContainer({});
        view.draw.info({});
        handle.info();
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputUp.add(handle.panelButton, panelButton);
            panelButton.events.onInputOver.add(() => {
                panelButton.events.onInputUp.active = true;
            }, panelButton);
            panelButton.events.onInputOut.add(() => {
                panelButton.events.onInputUp.active = false;
            }, panelButton);
        });

        let spinButtonDesk = view.draw.SpinButton({});
        spinButtonDesk.events.onInputUp.add(handle.spin);
        spinButtonDesk.events.onInputOver.add(() => {
            spinButtonDesk.events.onInputUp.active = true;
        });
        spinButtonDesk.events.onInputOut.add(() => {
            spinButtonDesk.events.onInputUp.active = false;
        });

        let stopButtonDesk = view.draw.StopButton({});
        stopButtonDesk.onInputDown.add(handle.stop);

        let autoButtonDesk = view.draw.AutoButton({});
        autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
        maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(handle.openInfo);

        let betLevelPlus = view.draw.PlusButton({});
        betLevelPlus.onInputDown.add(handle.betPlus);
        model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
        betLevelMinus.onInputDown.add(handle.betMinus);
        model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1109});
        coinsLevelPlus.onInputDown.add(handle.coinsPlus);
        model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 985});
        coinsLevelMinus.onInputDown.add(handle.coinsMinus);
        model.el('coinsLevelMinus', coinsLevelMinus);

    }

    function drawFsPanel() {
        view.draw.PanelBG({});
    }

    const handle = {
        spin: function () {
            if (model.state('buttons:locked')) return;

            soundController.sound.playSound({sound: 'buttonClick'});
            if (!model.state('autoplay:panelClosed')) {
                model.state('autoplay:panelClosed', true);
                view.hide.autoPanel({});
            }

            let game = model.el('game');
            game.input.keyboard.enabled = false;
            view.lockButtons();
            rollController.startRoll();
            rollController.fastRoll();
        },

        stop: function () {
            if (model.state('buttons:locked')) return;

            soundController.sound.playSound({sound: 'buttonClick'});
            model.state('autoplay:panelClosed', true);
            autoplayController.stop();
        },

        auto: function () {
            if (model.state('autoplay:start')
            || model.state('roll:progress')
            || model.state('panelInAnim') //проигрывается ли сейчас анимация закрытия/открытия панели
            || model.state('buttons:locked')) return;
            soundController.sound.playSound({sound: 'buttonClick'});

            if (model.state('autoplay:panelClosed') && !model.data('remainAutoCount')) {
                model.state('autoplay:panelClosed', false);
                view.show.autoPanel({});
            } else {
                model.state('autoplay:panelClosed', true);
                view.hide.autoPanel({});
            }
        },

        maxBet: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({toMax: true});
        },

        openInfo: function() {
            if(model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            soundController.sound.playSound({sound : 'buttonClick'});
            model.state('infoPanelOpen', true);
            let counter = 0;
            model.el('infoCounter', counter);
            model.group('infoTable').visible = true;
        },

        info: function() {

            let game = model.el('game');
            let infoRules = model.el('infoRules')
            let overlay = model.el('overlay');
            let closed = model.el('closed');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');

            game.input.keyboard.enabled = false;
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            infoRules.inputEnabled = true;
            infoRules.input.priorityID = 3;
            closed.inputEnabled = true;
            closed.input.priorityID = 4;
            arrowRight.inputEnabled = true;
            arrowRight.input.priorityID = 4;
            arrowLeft.inputEnabled = true;
            arrowLeft.input.priorityID = 4;

            overlay.events.onInputDown.add(handle.closeInfo);
            closed.events.onInputDown.add(handle.closeInfo);
            arrowRight.events.onInputDown.add(handle.switchInfoRight);
            arrowLeft.events.onInputDown.add(handle.switchInfoLeft);
        },

        closeInfo: function () {
            let game = model.el('game');
            let counter = 0;

            game.input.keyboard.enabled = true;
            model.group('infoTable').visible = false;
            model.el('infoCounter', counter);
            model.state('infoPanelOpen', false);
        },

        switchInfoRight: function () {
            let infoRules = model.el('infoRules');
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
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        switchInfoLeft: function () {
            let infoRules = model.el('infoRules');
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
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        betPlus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({up: true});
        },

        betMinus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({down: true});
        },

        coinsPlus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeCoin({up: true});
        },

        coinsMinus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeCoin({down: true});
        },

        panelButton: function () {
            // Если у нас автоплей или идет крутка, то не должна работать
            // При нажатии должна закрыть панель
            if (model.state('autoplay:start')
            || model.state('roll:progress')) return;

            const amount = this.amount;
            model.state('autoplay:panelClosed', true);
            view.hide.autoPanel({});
            autoplayController.start(amount);
        }

    };

    let auto = {

        start: function (amount) {
            let game = model.el('game');
            view.lockButtons();
            game.input.keyboard.enabled = false;
            view.draw.autoCount({amount});
            handle.auto();
        },

        stop: function () {
            let game = model.el('game');
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoOn.png';
            autoButtonDesk.freezeFrames = true;
            let stopButtonDesk = model.el('stopButtonDesk');
            stopButtonDesk.frameName = 'stopOn.png';
            stopButtonDesk.freezeFrames = true;

            if (model.state('ready')) {
                game.input.keyboard.enabled = true;
                view.unlockButtons();
            }

            view.draw.removeCount();
        },

        change: function (count) {
            view.draw.updateCount({count});
        }

    };

    return {
        drawButtons,
        drawFsPanel,
        auto,
        handle
    };

})();
