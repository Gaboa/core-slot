import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from '../../../Info/KeyboardController';
import { controller as soundController } from '../../../Info/SoundController';

import { view as mainView } from 'modules/States/Main/MainView';
import { controller as fsController } from 'modules/States/FS/FSController';
import { controller as winController } from 'modules/Win/WinController';

export let view = (() => {

    function fsStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        game.camera.flash(0x000000, 500);
        // Отрисовываем переходной экран
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();

        // Автопереход если включен
        game.time.events.add(config.autoTransitionTime, transitionInFs);
    }

    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.sound.playSound({sound: 'startPerehod'});

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = true;

        let jocker = game.add.sprite(game.width * 0.8, game.height * 0.2, 'popup', null, transitionContainer);
        jocker.anchor.set(0.5);
        jocker.scale.set(0.1);
        jocker.alpha = 0;
        model.el('jocker', jocker);

        let freeSpinsText = game.add.sprite(game.world.centerX, game.height * 0.2, 'text', 'freespin.png', transitionContainer);
        freeSpinsText.anchor.set(0.5);
        freeSpinsText.scale.set(0.1);
        freeSpinsText.alpha = 0;
        model.el('freeSpinsText', freeSpinsText);

        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsNumber = game.add.bitmapText(game.world.centerX, game.height * 0.5, 'numbersFont', '+' + freeSpinsCount, 70, transitionContainer);
        freeSpinsNumber.anchor.set(0.5);
        freeSpinsNumber.scale.set(0.1);
        freeSpinsNumber.alpha = 0;
        model.el('freeSpinsNumber', freeSpinsNumber);

        let continueText = game.add.sprite(game.world.centerX, game.height * 0.65, 'text', 'continue.png', transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.set(0.1);
        continueText.alpha = 0;
        model.el('continueText', continueText);

    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsText = model.el('freeSpinsText');
        let freeSpinsNumber = model.el('freeSpinsNumber');
        let jocker = model.el('jocker');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        // Анимации появления
        game.add.tween(freeSpinsNumber).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsText).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(continueText).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(jocker).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsNumber.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(freeSpinsText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(jocker.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(continueText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700)
            .onComplete.add(() => {
                game.add.tween(continueText.scale).to({x: 1.3, y: 1.3}, 1500, Phaser.Easing.Elastic.Out, true, 400, -1, true);
            });
    }

    function _fsStartInput() {
        // При клике на фон будет переход на Фри-Спины
        let darknessBG = model.el('darknessBG');
        darknessBG.inputEnabled = true;
        darknessBG.events.onInputDown.add(transitionInFs);
    }


    function transitionInFs() {
        soundController.sound.stopSound({sound: 'startPerehod'});
        soundController.music.playMusic('fsFon');
        model.state('transitionScreen', false);

        let game = model.el('game');
        let transitionContainer = model.group('transition');
        transitionContainer.removeAll();

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = false;

        winController.drawFsState();

    }


    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        // keyboardController.initFsKeys(transitionInFs);
        model.state('buttons:locked', false);
        // Темнота
        game.camera.flash(0x000000, 500);
        // Отрисовка финишного экрана
        _fsFinishDraw();
        _fsFinishTween();
        _fsFinishInput();

        model.state('maxFsMultiplier', false);
        // Автопереход
        game.time.events.add(config.autoTransitionTime, transitionOutFs);
    }

    function _fsFinishDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.sound.playSound({sound: 'finishPerehod'});

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = true;

        let jack = game.add.sprite(game.width * 0.2, game.height * 0.2, 'jack', null, transitionContainer);
        jack.anchor.set(0.5);
        // jack.scale.set(0.1);
        // jack.alpha = 0;
        model.el('jack', jack);

        let winTextFrame;
        if (model.data('fsMulti') === 8) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        let winText = game.add.sprite(model.el('gameMachine').width / 2, -400, 'text', winTextFrame);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(model.el('gameMachine').width / 2, -200, 'numbersFont', '0', 70);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        model.el('winCount', winCount);

        let continueText = game.add.sprite(model.el('gameMachine').width / 2, -200, 'text', 'continue.png', transitionContainer);
        continueText.anchor.set(0.5);
        model.el('continueText', continueText);

        transitionContainer.alpha = 0;

    }

    function _fsFinishTween() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        let jack = model.el('jack');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let continueText = model.el('continueText');

        game.add.tween(transitionContainer).to({alpha: 1}, 1000, 'Linear', true);
        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true, 500);
        game.add.tween(winCount).to({y: game.height * 0.5}, 1500, Phaser.Easing.Bounce.Out, true, 500);
        game.add.tween(continueText).to({y: game.height * 0.65}, 1500, Phaser.Easing.Bounce.Out, true, 500)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });

    }

    function _fsFinishInput() {
        // При клике на фон будет переход на Фри-Спины
        let darknessBG = model.el('darknessBG');
        darknessBG.inputEnabled = true;
        darknessBG.events.onInputDown.add(transitionOutFs);
    }

    function transitionOutFs() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        soundController.sound.stopSound({sound: 'finishPerehod'});
        let transitionContainer = model.group('transition');
        game.add.tween(transitionContainer).to({alpha: 0}, 500, 'Linear', true)
            .onComplete.add(() => {
                let darknessBG = model.el('darknessBG');
                darknessBG.visible = false;

                transitionContainer.removeAll();
                winText.destroy();
                winCount.destroy();

                fsController.changeToMain();
            }, this);
    }

    // Накрутка выигрыша
    function _сountMeter(count, elem) {
        let game = model.el('game');

        let timeLength = config.countMeterTime;
        let _clock = game.time.create(true);
        _clock.add(timeLength, () => {}, this);
        _clock.start();

        let anim = function () {
            let timer = timeLength - _clock.duration;
            let progress = timer / timeLength;
            if (progress > 1) {
                progress = 1;
            }
            elem.setText( parseInt(count * progress) );

            if (progress === 1) {
                game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
            }

        };
        game.frameAnims.push(anim);
    }


    return {
        fsStart,
        fsFinish,
        transitionInFs,
        transitionOutFs
    };

})();
