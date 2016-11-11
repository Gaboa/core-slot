import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/MobileSetBet/View';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    let game;

    let handle = {
        openPanel: function () {
            if (model.state('setbetPanel') === 'open') return;
            model.state('setbetPanel', 'open');
            if (model.state('side') === 'right') {
                let border = model.el('setbetBorder');
                border.x = model.el('setbetContainer').width - border.width;
            } else {
                model.el('setbetBorder').x = 0;
            }
            view.show.Panel({});
            view.show.Overlay({});
        },
        closePanel: function () {
            if (model.state('setbetPanel') === 'close') return;

            sound.sounds.button.play();
            if (model.state('setbetPanel') === 'open') {
                view.hide.Panel({});
            }

            view.hide.Overlay({});
            model.state('setbetPanel', 'close');
        },
        maxBet: function () {
            sound.sounds.button.play();
            model.changeBet({toMax: true});
        },
        betLevelPlus: function () {
            sound.sounds.button.play();
            model.changeBet({up: true});
        },
        betLevelMinus: function () {
            sound.sounds.button.play();
            model.changeBet({down: true});
        },
        coinPlus: function () {
            sound.sounds.button.play();
            model.changeCoin({up: true});
        },
        coinMinus: function () {
            sound.sounds.button.play();
            model.changeCoin({down: true});
        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 10;
            overlay.events.onInputDown.add(handle.closePanel);

        view.draw.Container({});

        let bg = view.draw.BG({});
            bg.inputEnabled = true;
            bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        let maxBetButton = view.draw.maxBetButton({});
            maxBetButton.inputEnabled = true;
            maxBetButton.input.priorityID = 12;
            maxBetButton.events.onInputDown.add(handle.maxBet);

        view.draw.BetLevelText({});
        view.draw.BetLevelBG({});
        view.draw.BetLevelValue({});
        let betLevelPlus = view.draw.BetLevelPlus({});
            betLevelPlus.inputEnabled = true;
            betLevelPlus.input.priorityID = 12;
            betLevelPlus.events.onInputDown.add(handle.betLevelPlus);
        let betLevelMinus = view.draw.BetLevelMinus({});
            betLevelMinus.inputEnabled = true;
            betLevelMinus.input.priorityID = 12;
            betLevelMinus.events.onInputDown.add(handle.betLevelMinus);

        view.draw.coinText({});
        view.draw.coinBG({});
        view.draw.coinValue({});
        let coinPlus = view.draw.CoinPlus({});
            coinPlus.inputEnabled = true;
            coinPlus.input.priorityID = 12;
            coinPlus.events.onInputDown.add(handle.coinPlus);
        let coinMinus = view.draw.CoinMinus({});
            coinMinus.inputEnabled = true;
            coinMinus.input.priorityID = 12;
            coinMinus.events.onInputDown.add(handle.coinMinus);

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.closePanel);

        model.state('setbetPanel', 'close');
    }

    let update = {

        CoinValue: function () {
            view.update.CoinValue({});
        },

        BetValue: function () {
            view.update.BetValue({});
        }

    };

    events.on('model:balance:update', update.CoinValue);
    events.on('model:balance:update', update.BetValue);

    return {
        init,
        handle
    };
})();
