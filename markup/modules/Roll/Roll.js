import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';
import { Wheel } from 'modules/Wheel/Wheel';
import { config } from 'modules/Util/Config';
import { util } from 'modules/Util/Util';
import { sound } from '../../modules/Sound/Sound';

export let roll = (function () {

    function initWheels(currentScreen, options) {
        let game = model.el('game');
        let machineContainer = model.el('machineContainer');
        let wheels = [];
        let elSize = config[model.state('res')].elements;

        let firstScreen = model.data('firstScreen');
        let firstWheels = Array(5);

        firstScreen.forEach((row, rowIndex) => {
            row.forEach((el, colIndex) => {
                firstWheels[colIndex] = firstWheels[colIndex] || [];
                firstWheels[colIndex].push(el);
            });
        });

        let elementsContainer = model.el('elementsContainer');

        for (let i = -2; i < 3; i++) {
            wheels.push(new Wheel({
                game, // в опциях можно передавать состояние и контейнер в котором создавать колеса
                parent: elementsContainer,
                position: {
                    x: i * elSize.width - config[model.state('res')].machine.x,
                    y: 0 - config[model.state('res')].machine.y * 2
                },
                elSize,
                currentScreen: firstWheels[i + 2]
            }));
        }
        model.el('wheels', wheels);
    }

    function rollRequest(options) {
        util.request('_Roll').then((data) => {

            events.trigger('roll:start');
            model.state('roll:progress', true);

            let nextScreen = data.Screen;
            if (typeof nextScreen === 'undefined') {
                // fast roll
                if (data.ErrorMessage === 'ReadyWaitActive') {
                    let wheels = model.el('wheels');
                    wheels.forEach((wheel) => {
                        wheel.fast();
                    });
                    return;
                }

                console.warn('Wrong Roll!', data.ErrorMessage);
                return;
            }
            let nextWheels = Array(5);

            nextScreen.forEach((row, rowIndex) => {
                row.forEach((el, colIndex) => {
                    nextWheels[colIndex] = nextWheels[colIndex] || [];
                    nextWheels[colIndex].push(el);
                });
            });

            startRoll(nextWheels, options);

            model.data('rollResponse', data);

        });
    }

    function startRoll(finishScreen, options = {}) {
        let wheels = model.el('wheels');
        let game = model.el('game');
        let duration;
        if (model.state('fastRoll') === false) {
            duration = config.wheel.roll.time / 1000;
        } else {
            duration = config.wheel.roll.fastTime / 1000;
        }
        sound.sounds.baraban.addMarker('roll', 0, duration, 1, false);
        sound.sounds.baraban.play('roll');

        let countFinish = 0;
        let callback = function () {
            ++countFinish;
            if (countFinish === 5) {
                events.trigger('roll:end');
                // console.log('Roll finished!');
            }
        };

        wheels.forEach((wheel, columnIndex) => {
            // Roll
            if (model.state('fastRoll')) {
                wheel.fast();
            }
            game.time.events.add(columnIndex * config.wheel.roll.deltaTime, () => {
                wheel.roll(finishScreen[columnIndex] || config.wheel.roll.finishScreen, {
                    // TODO: для обычних круток используй параметры конфига.
                    time: options.time,
                    length: options.length,
                    easingSeparation: options.ease,
                    callback
                });
            }, wheel);

        });
    }

    function rollEnd() {
        util.request('_Ready').then((data) => {
            // console.log('Ready done', data);
            if (!model.state('FSMode')) {
                let rollResponse = model.data('rollResponse');
                if (rollResponse.Balance.TotalWinCoins > 0) {
                    setTimeout(() => {
                        if (model.state('autoEnd')) return;
                        events.trigger('autoplay:next');
                    }, 1000)
                } else {
                    if (model.state('autoEnd')) return;
                    events.trigger('autoplay:next');
                }
            }

            // FS
            if (model.state('FSMode')) {

                let rollResponse = model.data('rollResponse');
                if (rollResponse.WinLines.length > 0) {
                    if (model.state('evilBrain')) {
                        setTimeout(() => {
                            // if (model.state('fsEnd')) return;
                            events.trigger('fs:next');
                            model.state('evilBrain', false);
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            // if (model.state('fsEnd')) return;
                            events.trigger('fs:next');
                        }, 1000);
                    }
                } else {
                    // if (model.state('fsEnd')) return;
                    events.trigger('fs:next');
                }

                let winSum = model.el('winSum');
                let totalWinSum = model.el('totalWinSum');

                totalWinSum.text = rollResponse.FsBonus.TotalFSWinCoins;
                winSum.text = rollResponse.Balance.TotalWinCoins;

            }
            model.state('roll:progress', false);
        });
    }

    events.on('roll:initWheels', initWheels);
    events.on('roll:request', rollRequest);
    events.on('roll:end', rollEnd);
    events.on('autoplay:startRoll', rollRequest);

    return {
        initWheels,
        startRoll
    };

})();
