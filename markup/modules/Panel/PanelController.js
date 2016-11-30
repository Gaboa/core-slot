import { model } from 'modules/Model/Model';
import { view } from 'modules/Panel/PanelView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    function init() {
        let game = model.el('game');

        view.draw.PanelBG({});
        view.draw.LinesNumber({});
        view.draw.AutoContainer({});
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputDown.add(handle.panelButton, panelButton);
        });

        let spinButtonDesk = view.draw.SpinButton({});
            spinButtonDesk.onInputDown.add(handle.spin);

        let autoButtonDesk = view.draw.AutoButton({});
            autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(handle.info);

        let betLevelPlus = view.draw.PlusButton({});
            betLevelPlus.onInputDown.add(handle.betPlus);
            model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
            betLevelMinus.onInputDown.add(handle.betMinus);
            model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1102});
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);
            model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 981});
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);
            model.el('coinsLevelMinus', coinsLevelMinus);

    }

    function initFS() {
        let game = model.el('game');

        view.draw.PanelBG({
            x: model.group('main').x,
            deltaY: -20,
            frameName: 'uiFS'
        });
        view.draw.LinesNumber({x: 55, y: 115});

        let infoButtonDesk = view.draw.InfoButton({x: 42, y: 27});
            infoButtonDesk.onInputDown.add(handle.info);

        let candle1 = view.draw.fsCandle({});
            candle1.scale.set(0.7);

        let time = game.rnd.integerInRange(10, 70);
        game.time.events.add(time, () => {
            let candle2 = view.draw.fsCandle({x: 878, y: 18});
        });
    }

    const handle = {
        spin: function() {
            if (model.state('lockedButtons')) return;

            sound.sounds.button.play();
            if (!model.state('autoClosed')) {
                model.state('autoClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }

            const spinButtonDesk = model.el('spinButtonDesk');
            if (spinButtonDesk.frameName == 'stop.png') {

                events.trigger('autoplay:stop');
                return;
            }

            events.trigger('roll:request');
            events.trigger('roll:fast');
        },

        auto: function() {
            if (!model.state('autoEnd') || model.state('roll:progress')) return;
            if (model.state('lockedButtons')) return;

            sound.sounds.button.play();
            if (model.state('autoClosed') && !model.data('remainAutoCount')) {
                model.state('autoClosed', false);
                view.show.autoButton({});
                view.show.autoPanel({});
            } else {
                model.state('autoClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }
        },

        maxBet: function() {
            if (model.state('lockedButtons')) return;
            if (model.state('autoEnd') == false) return;

            sound.sounds.button.play();
            model.changeBet({toMax: true});
        },

        info: function() {
            if(model.state('lockedButtons') || model.state('roll:progress') || !model.state('autoEnd')) return;
            sound.sounds.button.play();
            let game = model.el('game');
            let infoRules = view.show.info({});
            let overlay = model.el('overlay');
            let closed = model.el('closed');
            let infoMarkers = model.el('infoMarkers');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');
            let counter = 0;

            model.el('infoCounter', counter);
            model.state('infoPanelOpen', true);
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
            model.group('popup').removeAll();
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
            if (counter > 6) {
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
                counter = 7;
            } else {
                counter--;
                infoMarkers[counter + 1].frameName = 'marker_off.png';
            }
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        betPlus: function() {
            sound.sounds.button.play();
            model.changeBet({up: true});
        },

        betMinus: function() {
            sound.sounds.button.play();
            model.changeBet({down: true});
        },

        coinsPlus: function() {
            sound.sounds.button.play();
            model.changeCoin({up: true});
        },

        coinsMinus: function() {
            sound.sounds.button.play();
            model.changeCoin({down: true});
        },

        panelButton: function() {
            if (!model.state('autoPanel')) return ;
            if (!model.state('autoEnd') || model.state('roll:progress')) return;
            const amount = this.amount;
            events.trigger('autoplay:init', amount);
            model.state('autoPanel', false);
        }

    }

    function autoStart(amount) {
        if (model.state('mobile')) return;

        view.autoStartDesktop();
        view.draw.autoCount({amount});
        handle.auto();
    }

    function autoStop() {
        if (model.state('mobile')) return;

        view.autoStopDesktop();
        view.draw.removeCount();
    }

    function autoChangeCount(count) {
        if (model.state('mobile')) return;

        view.draw.updateCount({count});
    }

    function freezeInfo() {
        if(model.state('mobile')) return;
        if(!model.state('autoEnd')) return;

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'infoOn.png';
            infoButtonDesk.freezeFrames = true;
    }

    function unfreezeInfo() {
        if(model.state('mobile')) return;
        if(!model.state('autoEnd')) return;

        let infoButtonDesk = model.el('infoButtonDesk');
        infoButtonDesk.frameName = 'info.png';
        infoButtonDesk.freezeFrames = false;
    }

    events.on('roll:start', freezeInfo);
    events.on('roll:end', unfreezeInfo);

    events.on('autoplay:init', autoStart);
    events.on('autoplay:stop', autoStop);
    events.on('autoplay:count', autoChangeCount);

    return {
        init,
        autoStart,
        autoStop,
        initFS,
        handle
    };

})();
