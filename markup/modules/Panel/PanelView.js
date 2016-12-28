import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as balanceController } from 'modules/Balance/BalanceController';

export let view = (() => {

    let draw = {

        PanelBG: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX + config[model.res].panelMargin.x,
            y = model.el('gameMachine').height + config[model.res].panelMargin.y,
            frameName = 'ui',
            deltaY = 0
        }) {
            container.x = x;
            container.y = y;
            let panelBG = game.add.sprite(0, deltaY, frameName, null, container);

            let convert = game.add.sprite(985, 77, 'convert', null, container);
            convert.anchor.set(0.5);
            convert.inputEnabled = true;
            convert.events.onInputDown.add(() => {
                balanceController.changeCoinsToCash();
            });

            container.pivot.set(panelBG.width / 2, 0);
            return panelBG;
        },

        AutoContainer: function({
            game = model.el('game'),
            x = model.group('panel').width / 2 + 20,
            y = 65
        }) {
            let autoDesktopContainer = game.add.group();
                autoDesktopContainer.x = x;
                autoDesktopContainer.y = y;
                autoDesktopContainer.visible = false;

            model.el('autoDesktopContainer', autoDesktopContainer)
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        AnimatedSpinButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2 + 24,
            y = 68,
            container = model.group('panel')
        }) {
            let animatedSpinButton = game.add.sprite(x, y, 'deskButtonsAnim', null, container);
                animatedSpinButton.anchor.set(0.5);
                animatedSpinButton.visible = false;
                animatedSpinButton.animations.add(`spinToPanel`, Phaser.Animation.generateFrameNames(`button-1_`, 0, 22, '.png', 1), 120, false);
                animatedSpinButton.animations.add(`panelToStop`, Phaser.Animation.generateFrameNames(`button-2_`, 0, 22, '.png', 1), 120, false);
                animatedSpinButton.animations.add(`stopToSpin`, Phaser.Animation.generateFrameNames(`button-3_`, 0, 22, '.png', 1), 120, false);
                animatedSpinButton.animations.add(`panelToSpin`, Phaser.Animation.generateFrameNames(`button-4_`, 0, 22, '.png', 1), 120, false);
            model.el('animatedSpinButton', animatedSpinButton);
        },

        SpinButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2 + 22,
            y = 60,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
                spinButtonDesk.anchor.set(0.5);
                spinButtonDesk.visible = (model.data('remainAutoCount') > 0) ? false : true;

            model.el('spinButtonDesk', spinButtonDesk);

            return spinButtonDesk;
        },

        StopButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2 + 22,
            y = 60,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopOn.png', 'stop.png', 'stopOn.png', null, container);
                stopButtonDesk.anchor.set(0.5);
                stopButtonDesk.visible = (model.data('remainAutoCount') > 0) ? true : false;

            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        AutoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 92,
            y = 68
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
                autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 92,
            y = 68
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
                maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        InfoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.group('panel').width - 115,
            y = 105,
        }) {
            let infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
            model.el('infoButtonDesk', infoButtonDesk);
            return infoButtonDesk;
        },

        PlusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 344,
            y = 57,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 251,
            y = 58
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            return minusButtonDesk;
        },

        LinesNumber: function({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: 'normal 27px Helvetica, Arial', align: 'center', fill: '#e8b075'},
            x = 105,
            y = 116,
        }) {
            let linesNumber = game.add.text(x, y, '10', style, container);
            model.el('linesNumber', linesNumber);
            return linesNumber;
        },

        AutoPanel: function({
            game = model.el('game'),
            container = model.group('autoDesktop')
        }) {
            // let autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, container);
            //     autoplayBG.anchor.set(0.5);
            // model.el('autoplayBG', autoplayBG);

            let autoBG10 = this._AutoPanelItem({text: 10, x: -56, y: -36, width: 55, height: 26});
            let autoBG25 = this._AutoPanelItem({text: 25, x: 3, y: -36, width: 55, height: 26});
            let autoBG50 = this._AutoPanelItem({text: 50, x: -56, y: -10, width: 55, height: 24});
            let autoBG100 = this._AutoPanelItem({text: 100, x: 3, y: -10, width: 55, height: 24});
            let autoBG250 = this._AutoPanelItem({text: 250, x: -56, y: 16, width: 55, height: 26});
            let autoBG500 = this._AutoPanelItem({text: 500, x: 3, y: 16, width: 55, height: 26});

            model.el('autoBG10', autoBG10);
            model.el('autoBG25', autoBG25);
            model.el('autoBG50', autoBG50);
            model.el('autoBG100', autoBG100);
            model.el('autoBG250', autoBG250);
            model.el('autoBG500', autoBG500);

            let panelButtonsArr = [];
                panelButtonsArr.push(autoBG10, autoBG25, autoBG50, autoBG100, autoBG250, autoBG500)
            return panelButtonsArr;
        },

        _AutoPanelItem: function({
            game = model.el('game'),
            container = model.group('autoDesktop'),
            text = 10,
            x = -80,
            y = -62,
            width = 70,
            height = 37,
            font = 'normal 18px Arial',
            color = '#dbebf9',
            shadowColor = '#43abde'
        }) {
            let autoBG = game.add.graphics(0, 0, container).beginFill(0xffffff, 0.2).drawRect(0, 0, width, height);
                autoBG.x = x;
                autoBG.y = y;
                autoBG.amount = text;
                autoBG.alpha = 0;
                autoBG.inputEnabled = true;
                autoBG.events.onInputOver.add(function () {
                    autoBG.alpha = 1;
                });
                autoBG.events.onInputOut.add(function () {
                    autoBG.alpha = 0;
                });

            let autoText = game.add.text(
                autoBG.x + autoBG.width / 2,
                autoBG.y + autoBG.height / 2 + 2,
                text,
                {font: font, fill: color, align: 'center'},
                container);
                autoText.anchor.set(0.5);
                autoText.setShadow(0, 0, shadowColor, 2);

            return autoBG;
        },

        autoCount: function({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: '27px Arial, Helvetica', fill: '#f1f7fe', align: 'center'},
            amount = 10,
            x = model.el('autoButtonDesk').x - 2,
            y = model.el('autoButtonDesk').y + 5,
        }) {
            let font = (amount > 100) ? '21px Arial, Helvetica' : '27px Arial, Helvetica';
            style = {font: font, fill: '#f1f7fe', align: 'center'};
            let autoCount = game.add.text(x, y, amount, style, container);
                autoCount.anchor.set(0.5);
                autoCount.alpha = 0;

            model.el('autoCount', autoCount);
            game.add.tween(autoCount).to({alpha: 1}, 500, 'Linear', true, 200);
            return autoCount;
        },

        updateCount: function({
            count = 10
        }) {
            model.el('autoCount').text = count;
        },

        removeCount: function() {
            model.el('autoCount').destroy();
        },

    }

    function lockButtons() {

        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBetFreeze.png';
            maxBetButtonDesk.freezeFrames = true;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plusFreeze.png';
            betLevelPlus.freezeFrames = true;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minusFreeze.png';
            betLevelMinus.freezeFrames = true;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plusFreeze.png';
            coinsLevelPlus.freezeFrames = true
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minusFreeze.png';
            coinsLevelMinus.freezeFrames = true;
        let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoFreeze.png';
            autoButtonDesk.freezeFrames = true;

    }

    function unlockButtons() {
        if(model.state('autoplay:start')) return;

        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBet.png';
            maxBetButtonDesk.freezeFrames = false;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plus.png';
            betLevelPlus.freezeFrames = false;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minus.png';
            betLevelMinus.freezeFrames = false;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plus.png';
            coinsLevelPlus.freezeFrames = false
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minus.png';
            coinsLevelMinus.freezeFrames = false;
        let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.freezeFrames = false;
    }

    return {
        draw,
        lockButtons,
        unlockButtons
    };

})();
