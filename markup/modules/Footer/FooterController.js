import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

import { view } from 'modules/Footer/FooterView';

import { controller as soundController } from 'modules/Sound/SoundController';

export let controller = (() => {

    function initDesktop() {
        view.draw.DesktopFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({});
            homeButton.onInputDown.add(handle.Home);

        let menuButton = view.draw.MenuButton({});
            menuButton.onInputDown.add(handle.Menu);

        let soundButton = view.draw.SoundButton({});
            soundButton.freezeFrames = true;
            soundButton.onInputDown.add(handle.Sound);

        let fastButton = view.draw.FastButton({});
            fastButton.freezeFrames = true;
            fastButton.onInputDown.add(handle.Fast);
    }

    function initMobile() {
        view.draw.MobileFooter({alphaTop: 0.6, alphaBottom: 0.85});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({});
            homeButton.onInputDown.add(handle.Home);
    }

    function updateTime() {
        view.update.Time();
    }

    const handle = {
        Menu: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            let game = model.el('game');
            // Выключаем управление с клавиатуры
            game.input.keyboard.enabled = false;

            soundController.sounds.playSound('buttonClick');

            // Обновляем состояния чекбоксов в настройках
            $('#volume').prop('value', game.sound.volume * 100);
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimations').prop('checked', model.state('isAnimations'));
            $('#isAnimBG').prop('checked', model.state('isAnimBG'));
            $('#optionAutoplay4').prop('checked', model.state('autoStopWhenFS'));
            $('#optionAutoplay5').prop('checked', model.state('optionAutoplay5'));

            // Открываем настройки
            $('#settings').removeClass('closed');
            $('#darkness').removeClass('closed');

            // при клике на оверлей закрываем настройки
            $('#darkness').on('click', function () {
                // Включаем управление с клавиатуры
                game.input.keyboard.enabled = true;
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },

        Sound: function () {
            let soundButton = model.el('soundButton');
            if (model.state('globalSound')){
              model.state('globalSound', false)
                soundButton.frameName = 'soundOff.png';
                soundController.volume.switchVolume()
            } else {
                model.state('globalSound', true)
                soundButton.frameName = 'sound.png';
                soundController.volume.switchVolume();
            }
        },

        Fast: function () {
            soundController.sounds.playSound('buttonClick');
            let fastButton = model.el('fastButton');
            // Ищменяем состояние fastRoll и меняем фрейм кнопки
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                fastButton.frameName = 'fastSpin.png';
            } else {
                model.state('fastRoll', true);
                fastButton.frameName = 'fastSpinOff.png';
            }
        },

        Home: function () {
            soundController.sounds.playSound('buttonClick');
            // Отправляем запрос Logout
            request.send('Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            // Возвращаемся на предыдущую страницу
            window.history.back();
        }
    };

    return {
        initDesktop,
        initMobile,
        updateTime
    };

})();
