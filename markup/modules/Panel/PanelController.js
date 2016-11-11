import { model } from 'modules/Model/Model';
import { view } from 'modules/Panel/PanelView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    function init() {

        view.draw.PanelBG({});

        let game = model.el('game');
        let autoDesktopContainer = game.add.group();
        model.group('autoDesktop', autoDesktopContainer);
        model.group('panel').add(autoDesktopContainer);
            autoDesktopContainer.x = 650;
            autoDesktopContainer.y = 95;
            autoDesktopContainer.alpha = 0;

        view.draw.LinesNumber({});
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputDown.add(handle.panelButton, panelButton);
        });

        let spinButtonDesk = view.draw.SpinButton({});
            spinButtonDesk.input.priorityID = 1; // проанализировать зачем здесь приоритет
            spinButtonDesk.onInputDown.add(handle.spin);

        model.state('autoClosed', true); // состояние для кнопки авто, закрыта по умолчанию
        let autoButtonDesk = view.draw.AutoButton({});
            autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(handle.info);

        let betLevelPlus = view.draw.PlusButton({});
            model.el('betLevelPlus', betLevelPlus);
            betLevelPlus.onInputDown.add(handle.betPlus);

        let betLevelMinus = view.draw.MinusButton({});
            model.el('betLevelMinus', betLevelMinus);
            betLevelMinus.onInputDown.add(handle.betMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1100});
            model.el('coinsLevelPlus', coinsLevelPlus);
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 985});
            model.el('coinsLevelMinus', coinsLevelMinus);
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);

    }

    const handle = {
        spin: function() {
            sound.sounds.button.play();
            const spinButtonDesk = model.el('spinButtonDesk');
            if (spinButtonDesk.frameName == 'stop.png') {
                events.trigger('autoplay:stop:desktop');
                return;
            }
            events.trigger('roll:request');
        },

        auto: function() {
            const autoButtonDesk = model.el('autoButtonDesk');
            sound.sounds.button.play();
            if (model.state('autoClosed')) {
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
            if (model.state('autoEnd') == false) return;
            sound.sounds.button.play();
            model.changeBet({toMax: true});
        },

        info: function() {
            sound.sounds.button.play();
            let infoRules = view.show.info({});
                infoRules.inputEnabled = true;
                infoRules.input.priorityID = 2;
                infoRules.events.onInputDown.add(() => {
                    let overlay = model.el('overlay');
                    overlay.destroy();
                    infoRules.destroy();
                });
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
            const amount = this.amount;
            events.trigger('autoplay:init:desktop', amount);
        }

    }

    function autoStart() {
        view.autoStartDesktop();
    }

    function autoStop() {
        view.autoStopDesktop();
    }

    // events.on('autoplay:init:desktop', handleAuto); // ивент для запуска автоплея, автоматически закрывает панель

    return {
        init,
        autoStart,
        autoStop
    };

})();
