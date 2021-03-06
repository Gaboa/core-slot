import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/InitView';
import { controller as soundController} from '../../../../Info/SoundController';
import { controller as keyboardController} from '../../../../Info/KeyboardController';

export class Init {
    constructor(game) {

    }
    init() {
        let game = model.el('game');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Воспроивзодит музыку но сама музыка не играет если не сделать такой костыль
        // setTimeout(() => {
        soundController.music.playMusic('initFon');

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;
    }

    create() {
        let game = model.el('game');

	    game.input.maxPointers = 1;
	    this.game.plugins.add(new Phaser.Plugin.SaveCPU(this));

        game.camera.flash(0x000000, 500);

        view.drawBG();
        view.drawBGLogo();
        view.drawLogo();


        let initPlay = view.drawPlay();

        // Костыльный фулскрин
        this.stateHandler = this.handlePlay.bind(this);

        if (model.mobile && !game.device.iOS) {
            let fakeButton = document.querySelector('#fakeButton');
            $('#fakeButton').removeClass('closed');
            fakeButton.addEventListener('click', this.fullScreen);
            fakeButton.addEventListener('click', this.stateHandler);
        } else {
            initPlay.inputEnabled = true;
            initPlay.events.onInputDown.add(this.handlePlay, this);
        }

        if (model.desktop) {
            keyboardController.initInitKeys(this.stateHandler);
        }

        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        this.drawSoundTrigger();


        if (!model.state('globalSound')) {
            this.sprite2.x = 270;
            this.textOff.setStyle(this.styleOn);
            this.textOn.setStyle(this.styleOff);
        }
    }

    switchSound() {
        if (model.state('globalSound')) {
            soundController.volume.switchVolume();
            this.sprite2.x = 270;
            this.textOff.setStyle(this.styleOn);
            this.textOn.setStyle(this.styleOff);
        } else {
            soundController.volume.switchVolume();
            this.sprite2.x = 310;
            this.textOff.setStyle(this.styleOff);
            this.textOn.setStyle(this.styleOn);
        }
    }

    fullScreen() {
        let game = model.el('game');
        game.scale.startFullScreen();
    }

    handlePlay() {
        const game = model.el('game');

        if (model.mobile) {
            game.scale.startFullScreen();
        }

        view.stopYoyoTween();
        let fakeButton = document.querySelector('#fakeButton');
        fakeButton.removeEventListener('click', this.stateHandler);

	    game.camera.onFadeComplete.add(() => {
		    game.camera.onFadeComplete.removeAll();
		    switch (model.data('savedFS').state) {
			    case 'Freespin': game.state.start('FS');
				    break;
			    default: {
			        model.data('savedFS', null);
			        game.state.start('Main');
			    }
				    break;
		    }
	    });

	    // make fakebutton 100% width again
	    $('#fakeButton').addClass('fullwidth')

        game.camera.fade(0x000000, 500);
    }

    drawSoundTrigger() {
        const game = model.el('game');
        let soundContainer = game.add.group();
        soundContainer.position.set(game.width - 500, game.height - 100);

        let background = game.add.graphics(0, 0);
        background.beginFill(0x000000, 0.1);
        background.drawRoundedRect(soundContainer.x - 30, soundContainer.y - 15, 470, 80, 40);

        let style = { font: "bold 42px Arial", fill: "#f3eba0"};
        let textSound = game.add.text(0, 0, "Sound:", style, soundContainer);
        this.styleOff = { font: 'bold 42px Arial', fill: '#474747'};
        this.textOff = game.add.text(170, 0, 'Off', style, soundContainer);
        this.textOff.setStyle(this.styleOff);
        this.styleOn = { font: 'bold 42px Arial', fill: '#b8ff31'};
        this.textOn = game.add.text(350, 0, 'On', style, soundContainer);
        this.textOn.setStyle(this.styleOn);

        let graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x6da600, 1);
        graphics.drawRoundedRect(0, 0, 70, 30, 150);

        let sprite = game.add.sprite(290, 25, graphics.generateTexture(), null, soundContainer);
        sprite.anchor.set(0.5);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(this.switchSound, this);
        graphics.destroy();

        let graphics2 = game.add.graphics(0, 0);
        graphics2.beginFill(0xffffff, 1);
        graphics2.drawCircle(0, 0, 30);
        this.sprite2 = game.add.sprite(310, 25, graphics2.generateTexture(), null, soundContainer);
        this.sprite2.anchor.set(0.5);
        graphics2.destroy();
    }
}
