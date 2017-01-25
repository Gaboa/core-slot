import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { controller as soundController } from 'modules/Sound/SoundController';

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
            model.group('transition', game.add.group());
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
            let deltaY = (model.desktop) ? 45 : -25;
            let gameMachineBG = game.add.sprite(0, deltaY, 'gameMachineBG', null, container);
                gameMachineBG.anchor.set(0.5);
            model.el('gameMachineBG', gameMachineBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);
        },

        addBubbles: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let emitter = game.add.emitter(game.world.centerX, game.height + 200, 400);
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
            let y = game.rnd.integerInRange(200, 600);
            let shark = game.add.sprite(-500, y, 'shark', null, container);
            shark.anchor.set(0.5);
            if (model.mobile) {
                shark.scale.set(0.6);
            }
            shark.animations.add('move');
            shark.animations.play('move', 20, true);
            model.el('shark', shark);

            let time = game.rnd.integerInRange(10, 14);
            let side = (game.rnd.sign() < 0) ? 'left' : 'right';
            console.log(side);

            shark.x = (side === 'left') ? -shark.width : game.width + shark.width;
            let delta = (side === 'left') ? game.width + shark.width : -shark.width;
            if (side === 'right') {
                shark.width = -shark.width;
            }

            game.add.tween(shark).to({x: delta}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    shark.destroy();
                    game.time.events.add(6000, () => {
                        this.addShark({});
                    });
                }, this);
        },

        // addPole: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     let pole = game.add.spine(50, game.height * 0.95, 'pole');
        //     pole.setAnimationByName(1, '1', true);
        //     model.group('bg').add(pole);
        //     pole.scale.set(0.5);
        //     model.el('pole', pole);
        //
        //     let time = game.rnd.integerInRange(10, 14);
        //     let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
        //
        //     pole.x = (side === 'left') ? -pole.width : game.width + pole.width;
        //     let delta = (side === 'left') ? game.width + pole.width : -pole.width;
        //     if (side === 'right') {
        //         pole.width = -pole.width;
        //     }
        //
        //     game.add.tween(pole).to({x: delta}, time * 1000, 'Linear', true)
        //         .onComplete.add(() => {
        //             pole.destroy();
        //             game.time.events.add(6000, () => {
        //                 this.addPole({});
        //             });
        //         }, this);
        //
        // },
        //
        // addBird: function ({
        //     game = model.el('game'),
        //     container = model.group('bg'),
        //     bird = game.add.sprite(game.width * 0.92, 260, 'bird', null, container),
        //     animName1 = 'idle1-',
        //     animName2 = 'idle2-',
        //     animName3 = 'idle3-',
        //     side = 'right',
        //     birdFly = game.add.sprite(game.width + 200, 160, 'birdFly', null, container),
        // }) {
        //     bird.anchor.set(0.5);
        //     bird.inputEnabled = true;
        //     bird.input.priorityID = 1;
        //     bird.input.pixelPerfectOver = true;
        //     //TODO разобраться с этим извращенством
        //     bird.events.onInputOver.add(()=>{
        //         if(bird.input.isPixelPerfect()) bird.input.priorityID = 3;
        //     })
        //     bird.events.onInputOut.add(()=>{
        //         bird.input.priorityID = 1;
        //     })
        //     bird.events.onInputDown.add(()=>{
        //         draw._flyBird();
        //         soundController.sound.playSound({sound: 'lineWin'});
        //     });
        //     model.el('bird', bird);
        //     model.el('sideBird', side);
        //
        //     let birdAnim = bird.animations.add('idle', Phaser.Animation.generateFrameNames(animName1, 0, 24, '.png', 2));
        //     let birdAnim2 = bird.animations.add('idle2', Phaser.Animation.generateFrameNames(animName2, 0, 24, '.png', 2));
        //     let birdAnim3 = bird.animations.add('idle3', Phaser.Animation.generateFrameNames(animName3, 0, 24, '.png', 2));
        //
        //     model.el('birdAnim', birdAnim);
        //     model.el('birdAnim2', birdAnim2);
        //     model.el('birdAnim3', birdAnim3);
        //
        //     if (side === 'right') {
        //         bird.visible = false;
        //         birdFly.anchor.set(0.5);
        //         let flyAnim = birdFly.animations.add('fly', Phaser.Animation.generateFrameNames('fli2', 0, 24, '.png', 2));
        //         flyAnim.play(15);
        //         game.add.tween(birdFly).to({x: game.width * 0.92, y: 260}, 500, 'Linear', true, 500)
        //             .onComplete.add(() =>{
        //                 birdFly.destroy();
        //                 bird.visible = true;
        //             })
        //     }
        //     birdAnim.play(15, true);
        //     this._nextBirdAnim({});
        //
        // },
        //
        // _nextBirdAnim: function ({
        //     game = model.el('game'),
        //     birdAnim = model.el('birdAnim')
        // }) {
        //     let timer = game.time.events.add(10000, () => {
        //         // Играем следующую случайную анимацию
        //         let number = game.rnd.integerInRange(2, 3);
        //         let nextAnim = model.el(`birdAnim${number}`);
        //         nextAnim.play(15);
        //         nextAnim.onComplete.add(() => {birdAnim.play(15, true)}, this);
        //         // Запускаем таймер снова
        //         this._nextBirdAnim({});
        //     });
        //     model.el('timer', timer);
        // },
        //
        // _flyBird: function () {
        //     let game = model.el('game');
        //     let container = model.group('bg');
        //     let bird = model.el('bird');
        //         bird.visible = false;
        //     let sideBird = model.el('sideBird');
        //     let timer = model.el('timer');
        //     game.time.events.remove(timer);
        //
        //     let birdFly, flyAnim;
        //     if (sideBird === 'left') {
        //         birdFly = game.add.sprite(130, 590, 'birdFly', 'fli200.png', container);
        //             model.el('birdFly', birdFly);
        //             birdFly.anchor.set(0.5);
        //         flyAnim = birdFly.animations.add('fly', Phaser.Animation.generateFrameNames('fli2', 0, 24, '.png', 2));
        //             flyAnim.play(15);
        //         game.add.tween(birdFly).to({x: -400, y: 590}, 1000, Phaser.Easing.Circular.InOut, true, 500)
        //         .onComplete.add(() => {
        //             birdFly.visible = false;
        //             draw.addBird({});
        //         }, this);
        //     } else {
        //         birdFly = game.add.sprite(game.width * 0.92, 265, 'birdFly', 'fli100.png', container);
        //             model.el('birdFly', birdFly);
        //             birdFly.anchor.set(0.5);
        //         flyAnim = birdFly.animations.add('fly', Phaser.Animation.generateFrameNames('fli1', 0, 24, '.png', 2));
        //             flyAnim.play(15);
        //         game.add.tween(birdFly).to({x: 130, y: 590}, 1000, Phaser.Easing.Circular.InOut, true, 500)
        //         .onComplete.add(() => {
        //             birdFly.visible = false;
        //             draw.addBird({
        //                 bird: game.add.sprite(130, 590, 'bird2', null, container),
        //                 animName1: 'idle1-2-',
        //                 animName2: 'idle2-2-',
        //                 animName3: 'idle3-2-',
        //                 side: 'left'
        //             });
        //         }, this);
        //     }
        // },
        //
        // addTable: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     let counter = 0;
        //     let table = game.add.sprite(game.width * 0.855, 500, 'table', null, container);
        //     table.anchor.set(0.5);
        //
        //     model.el('table', table);
        //
        //     let tableAnim = table.animations.add('idle', Phaser.Animation.generateFrameNames('skeleton-animation_', 0, 27, '.png', 1));
        //     tableAnim.play(12, true);
        // },
        //
        // addSkull: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     let skull = game.add.sprite(game.width * 0.1, game.height * 0.8, 'skull', 'Scull-1_0.png', container);
        //     skull.anchor.set(0.5);
        //     skull.scale.set(0.7);
        //     model.el('skull', skull);
        //
        //     game.time.events.add(15000 * Math.random(), () => {
        //         draw.animSkull(skull);
        //     });
        // },
        //
        // animSkull: function (skull) {
        //     let game = model.el('game');
        //     let skullAnim = skull.animations.add('idle');
        //         skullAnim.play(12);
        //         skullAnim.onComplete.add(() => {skull.frameName = 'Scull-1_0.png'}, this);
        //     game.time.events.add(15000 * Math.random(), () => {
        //         draw.animSkull(skull);
        //     });
        // },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let lineNumbersArr = [];
            let deltaYright = (model.desktop) ? 105 : 81;
            let deltaYleft = (model.desktop) ? 109 : 83;

            for (let i = 1; i < 22; i++) {
                side = config[model.res].win[i][0].side;
                let x = (side == 'right') ? gameMachine.right - deltaYright : gameMachine.left + deltaYleft;
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2,
                    'winSplash',
                    'skeleton-animation_5.png',
                    container);

                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.visible = false;

                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames('skeleton-animation_', 1, 14, '.png', 1), 20, false);

                if (model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.hitArea = new Phaser.Circle(0, 0, 50);

                lineNumber.events.onInputOver.add(() => {
                    // console.log('i am here', i);
                    // if (lineNumber.lineShape) {
                    //     lineNumber.lineShape.destroy();
                    // }
                    //
                    // lineNumber.lineShape = this.lineShape(lineNumber.name);
                });

                lineNumber.events.onInputOut.add(() => {
                    // if (lineNumber.lineShape) {
                    //     lineNumber.lineShape.destroy();
                    // }
                });

                lineNumbersArr.push(lineNumber);
            }

            model.el('lineNumbersArr', lineNumbersArr);
        },

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           let gameMachine = model.el('gameMachine');
           lineShape
               .lineStyle(4, 0x188bb4, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - gameMachine.width / 2 + 50, (line[0].Y + 0.5) * elSize.height - gameMachine.height / 2 + 50)
               .lineTo((line[1].X + 0.5) * elSize.width - gameMachine.width / 2 + 50, (line[1].Y + 0.5) * elSize.height - gameMachine.height / 2 + 50)
               .lineTo((line[2].X + 0.5) * elSize.width - gameMachine.width / 2 + 50, (line[2].Y + 0.5) * elSize.height - gameMachine.height / 2 + 50)
               .lineTo((line[3].X + 0.5) * elSize.width - gameMachine.width / 2 + 50, (line[3].Y + 0.5) * elSize.height - gameMachine.height / 2 + 50)
               .lineTo((line[4].X + 0.5) * elSize.width - gameMachine.width / 2 + 50, (line[4].Y + 0.5) * elSize.height - gameMachine.height / 2 + 50)
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
            container.addAt(numbersContainer, 3);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 4);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 5);
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
            let deltaY = (model.desktop) ? 50 : -25;
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        showPopup: function ({
            game = model.el('game'),
            container = model.group('popup'),
            message = 'popup',
            font = 'normal 45px Arial',
            color = '#c28531',
            balance = false
        }) {
            let overlay = game.add.graphics(0, 0, container)
                .beginFill(0x000000, 0.8)
                .drawRect(0, 0, game.width, game.height);

            let popup = game.add.sprite(
                game.width / 2,
                game.height / 2,
                'popup',
                null,
                container);
                popup.anchor.set(0.5);
            model.el('popup', popup);

            let popupText = game.add.text(
                popup.x - 40,
                popup.y,
                message,
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: 380, stroke: '#000000', strokeThickness: 3},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });
        },

        flyingSmoke: function({
            game = model.el('game'),
            container = model.group('bg'),
            x = game.width / 39,
            y = game.height / 5.6,
            speed = 60000,
            delay = game.rnd.between(1000, 20000)
        }){
            let smoke = game.add.sprite(x, y, 'smoke', null, container);
                smoke.anchor.set(0.5);
                smoke.scale.set(0.1);
                smoke.alpha = 0;

            let scaleX = (model.desktop)? 1 : 0.6;
            let scaleY = (model.desktop)? 1 : 0.6;
            game.add.tween(smoke).to({alpha: 0.8 }, 300, Phaser.Easing.Sinusoidal.InOut, true, delay);
            game.add.tween(smoke.scale).to({y: scaleX, x: scaleY}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay)
            game.add.tween(smoke).to({y: smoke.y / 2}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay)
                .onComplete.add(()=>{
                    game.add.tween(smoke).to({y: -smoke.y, alpha: 0}, speed / 3, Phaser.Easing.Quintic.In, true)
                        .onComplete.add(()=>{
                            smoke.destroy();
                            draw.flyingSmoke({});
                        })

                });
        }

    };

    return {
        create,
        draw
    };
})();
