import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('popup', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('transition', game.add.group());
            model.group('footerMenu', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            gameMachine.alpha = 0;
            model.el('gameMachine', gameMachine);

            let deltaX = (model.desktop) ? 106 : 81;
            let deltaY = (model.desktop) ? 55 : 50;
            let deltaY2 = (model.desktop) ? 37 : -18;
            let y1 = (model.desktop) ? 95 : 70;
            let y2 = (model.desktop) ? 100 : 15;
            let x = (model.desktop) ? 0 : 80;

            let fonTop = game.add.sprite(x, gameMachine.top + y1, 'fonTop', null, container);
            fonTop.anchor.set(0.5);

            let fonBottom = game.add.sprite(x, gameMachine.bottom - y2, 'fonBottom', null, container);
            fonBottom.anchor.set(0.5);

            let logoGM = game.add.sprite(0, gameMachine.top + deltaY, 'logoGM', null, container);
            logoGM.anchor.set(0.5);

            let lineLeft = game.add.sprite(gameMachine.left + deltaX, config[model.res].gameMachine.y - deltaY2, 'lineLeft', null, container);
            lineLeft.anchor.set(0.5);

            let lineRight = game.add.sprite(gameMachine.right - deltaX, config[model.res].gameMachine.y - deltaY2, 'lineRight', null, container);
            lineRight.anchor.set(0.5);
        },

        addLight: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            for (let i = 0; i < 3; i++) {
                let topLight = game.add.sprite(0 - i * game.rnd.integerInRange(25, 35), 0 - i * game.rnd.integerInRange(15, 25), 'topLight');
                topLight.alpha = game.rnd.integerInRange(0, 70) / 100;
                game.add.tween(topLight)
                    .to({alpha: game.rnd.integerInRange(30, 70) / 100}, game.rnd.integerInRange(3000, 5000), 'Linear', true, null, -1, true);
            }
        },

        // eyeLight: function ({
        //     game = model.el('game'),
        //     container = model.group('main')
        // }) {
        //     let eyeLight = game.add.sprite((model.desktop) ? -235 : -135, (model.desktop) ? -373 : -320, 'eyeLight', null, container);
        //     eyeLight.anchor.set(0.5);
        //     eyeLight.alpha = 0;
        //
        //     game.add.tween(eyeLight).to({angle: 45, alpha: 1}, 300, 'Linear', true)
        //         .onComplete.add(() => {
        //             game.add.tween(eyeLight).to({alpha: 0}, 300, 'Linear', true);
        //             eyeLight.destroy();
        //             game.time.events.add(7000, () => {
        //                 this.eyeLight({});
        //             });
        //         });
        //
        // },
        //
        // labelLight: function ({
        //     game = model.el('game'),
        //     container = model.group('main')
        // }) {
        //     let labelLight = game.add.sprite((model.desktop) ? -200 : -290, (model.desktop) ? -360 : -310, 'labelLight', null, container);
        //     labelLight.anchor.set(0.5);
        //     labelLight.alpha = 0;
        //     (model.desktop) ? labelLight.scale.set(0.15) : labelLight.scale.set(0.1);
        //     labelLight.animations.add('move');
        //     labelLight.animations.play('move', 20, false);
        //
        //     game.add.tween(labelLight).to({alpha: 1, x: labelLight.x + 400}, 500, 'Linear', true)
        //         .onComplete.add(() => {
        //             game.add.tween(labelLight).to({alpha: 0}, 300, 'Linear', true);
        //             labelLight.destroy();
        //             game.time.events.add(8000, () => {
        //                 this.labelLight({});
        //             });
        //         });
        // },

        addBubbles: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let emitter = game.add.emitter(0, game.height + 200, 400);
            container.add(emitter);
            emitter.makeParticles('bubble');
            emitter.width = game.width;

            emitter.setRotation(0, 0);
            emitter.setAlpha(0.1, 1, 3000);
            emitter.minParticleScale = 0.1;
            emitter.maxParticleScale = 0.4;
            emitter.setYSpeed(20, 80);
            emitter.gravity = -200;

            emitter.start(false, 7000, 150);
        },

        addShark: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let y = (model.desktop) ? game.rnd.integerInRange(150, 400) : game.rnd.integerInRange(100, 300);
            let shark = game.add.sprite(-500, y, 'shark');
            container.addAt(shark, 1);
            shark.anchor.set(0.5);
            if (model.mobile) {
                shark.scale.set(0.6);
            }
            shark.animations.add('move');
            shark.animations.play('move', 20, true);
            model.el('shark', shark);

            let time = game.rnd.integerInRange(10, 14);
            let side = (game.rnd.sign() < 0) ? 'left' : 'right';

            shark.x = (side === 'left') ? -shark.width : game.width + shark.width;
            let delta = (side === 'left') ? game.width + shark.width : -shark.width;
            if (side === 'right') {
                shark.width = -shark.width;
            }

            game.add.tween(shark).to({x: delta}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    shark.destroy();
                    game.time.events.add(10000, () => {
                        this.addShark({});
                    });
                }, this);

        },

        addFishes: function ({
            game = model.el('game'),
            container = model.group('bg'),
            y1 = (model.desktop) ? 450 : 350,
            y2 = (model.desktop) ? 700 : 600
        }) {
            let fishes = [];
            let side = (game.rnd.sign() < 0) ? 'left' : 'right';

            for (let i = 0; i < game.rnd.integerInRange(5, 10); i++) {

                let x = (side === 'left') ? game.rnd.integerInRange(430, 500) * -1 : game.width + game.rnd.integerInRange(430, 500);
                let y = game.rnd.integerInRange(y1, y2);

                let fish = game.add.sprite(x, y, 'fish', null, container);
                fish.anchor.set(0.5);
                (model.desktop) ? fish.scale.set(game.rnd.integerInRange(6, 10) / 10) : fish.scale.set(game.rnd.integerInRange(4, 8) / 10);

                fish.animations.add('move');
                fish.animations.play('move', 20, true);
                if (side === 'left') {
                    fish.width = -fish.width;
                }
                model.el('fish', fish);
                fishes.push(fish);
            }
            fishes.forEach((fish) => {
                let time = game.rnd.integerInRange(7, 9);
                let deltaX = (side === 'left') ? game.width + 500 : -500;
                game.add.tween(fish).to({x: deltaX}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    fish.destroy();
                }, this);
            });
            game.time.events.add(20000, () => {
                if (model.state('bonus')) {
                    this.addFishes({y1: (model.desktop) ? 600 : 400, y2: (model.desktop) ? 900 : 700});
                } else {
                    this.addFishes({});
                }
            });
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let lineNumbersArr = [];

            let y = (model.desktop) ?
                [252, 297, 342, 387, 495, 540, 585, 735, 780, 825, 871, 252, 297, 342, 387, 543, 590, 633, 735, 780, 825, 870] :
                [90, 123, 158, 193, 273, 309, 340, 455, 490, 525, 560, 90, 123, 158, 193, 309, 344, 379, 455, 490, 525, 560];

            let numbs = [4, 6, 18, 11, 9, 1, 20, 10, 19, 7, 5, 13, 15, 2, 17, 1, 21, 8, 16, 3, 14, 12];

            let deltaXright = (model.desktop) ? 105 : 81;
            let deltaXleft = (model.desktop) ? 109 : 83;
            let x = gameMachine.left + deltaXleft;

            for (let i = 0; i < 22; i++) {
                if (i == 11) x = gameMachine.right - deltaXright;
                let lineNumber = game.add.sprite(x, y[i] - gameMachine.height / 2,
                    'winSplash',
                    'skeleton-animation_5.png',
                    container);

                lineNumber.name = numbs[i];
                lineNumber.anchor.set(0.5);
                lineNumber.alpha = 0.05;

                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames('skeleton-animation_', 1, 14, '.png', 1), 20, false);

                if (model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.hitArea = new Phaser.Circle(0, 0, 50);

                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        game.time.events.add(1000, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.lineShape.destroy();
                            }
                        });
                    });
                }

                lineNumbersArr.push(lineNumber);
            }

            model.el('lineNumbersArr', lineNumbersArr);
        },

        lineShape: function (number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            let gameMachine = model.el('gameMachine');
            let deltaX = 150;
            let deltaY = (model.desktop) ? 200 : 80;
            lineShape
               .lineStyle(4, 0xeeeeee, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[0].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[1].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[1].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[2].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[2].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[3].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[3].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[4].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[4].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY);
            return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 2);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 3);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 4);
            model.group('winTop', winTop);

            machineGroup.glistaLightContainer = game.add.group();
            model.group('glistaLight', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.group('elements', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.group('glista', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 50 : 25;
            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 250, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 550, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        initPopup: function () {
            let popup = document.querySelector('#popup');
            popup.addEventListener('click', draw.closePopup);
        },

        showPopup: function ({
            message = 'popup',
            balance = false
        }) {
            model.state('notReload', balance);

            let popup = document.querySelector('#popup');
            let overlay = document.querySelector('#darkness');
            let popupText = document.querySelector('#popup h2');
            let popupBottomText = document.querySelector('#popup p');
            let bottomText;

            popup.classList.remove('closed');
            overlay.classList.remove('closed');

            popupText.innerHTML = message;

            if (model.desktop) {
                bottomText = `Click to ${(balance) ? 'close' : 'restart'}`;
            } else {
                bottomText = `Tap to ${(balance) ? 'close' : 'restart'}`;
            }

            popupBottomText.innerHTML = bottomText;
        },

        closePopup: function() {
            if (model.state('notReload')) {
                let popup = document.querySelector('#popup');
                let overlay = document.querySelector('#darkness');

                popup.classList.add('closed');
                overlay.classList.add('closed');
            } else {
                window.location.reload();
            }
        }

    };

    return {
        create,
        draw
    };
})();
