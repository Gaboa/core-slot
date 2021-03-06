import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export class Element {

    constructor({ position, container }) {
        let game = model.el('game');

        // Создаем контейнер для элементов (это будет один элемент на экране)
        this.group = game.add.group(container);
        this.group.x = position.x;
        this.group.y = position.y;

        // Заполняем его спрайтами всех элементов (они будут расположенны друг на друге)
        this.sprites = [];
        for (let i = 1; i <= config.symbolsCount; i++) {
            // Создаем по спрайту для каждого символа и делаем их не видимыми
            let sprite = game.add.sprite(0, 0, i, null, this.group);
                sprite.anchor.set(0.5);
                sprite.visible = false;
            this.sprites.push(sprite);

            // Каждому спрайту добавляем необходимые анимации
            this.addSpriteAnimation(sprite, i);
        }

        // По умолчанию все символы будут проигрывать анимацию "1-n" и этот символ будет видимым
        this.active = 1;
        this.activeSprite = this.sprites[0];
        this.activeSprite.visible = true;
        this.activeSprite.animations.play('1-n');
    }

    play(animation) {
        // Если спрайт уже проигрывает нужную нам анимацию, то мы ничего не будем делать чтобы анимация не прыгала
        if (this.activeSprite.animations.currentAnim.name === animation) return;

        // Делаем невидимым спрайт который раньше играл анимацию
        this.activeSprite.visible = false;

        // Находим новый активный спрайт, делаем его видимым и запускаем нужную анимацию
        this.active = parseInt(animation);
        this.activeSprite = this.sprites[this.active - 1];
        this.activeSprite.visible = true;
        this.activeSprite.animations.play(animation);
    }

    win() {
        // Проигрывам выигрышную анимацию
        this.play(`${this.active}-w`);
        this.activeSprite.animations.currentAnim.onComplete.add(() => {
            // После которой опять играем нормальную анимацию
            this.play(`${this.active}-n`);
        });
    }

    hide() {
        // Делаем элемент полупрозрачным
        this.activeSprite.alpha = 0.5;
    }

    show() {
        // Возращаем нормальное состояние
        this.activeSprite.alpha = 1;
    }

    // Вспомогательные методы для добавления анимаций для спрайтов
    addSpriteAnimation(sprite, index) {
        switch (index) {
            case 1:
                this.addAnimation(sprite, { el: 1, n: false, w: 16 });
                break;
            case 2:
                this.addAnimation(sprite, { el: 2, n: 16, w: 16 });
                break;
            case 3:
                this.addAnimation(sprite, { el: 3, n: false, w: 16 });
                break;
            case 4:
                this.addAnimation(sprite, { el: 4, n: 16, w: 16 });
                break;
            case 5:
                this.addAnimation(sprite, { el: 5, n: false, w: 16 });
                break;
            case 6:
                this.addAnimation(sprite, { el: 6, n: 16, w: 16 });
                break;
            case 7:
                this.addAnimation(sprite, { el: 7, n: false, w: 16 });
                break;
            case 8:
                this.addAnimation(sprite, { el: 8, n: 16, w: 16 });
                break;
            case 9:
                this.addAnimation(sprite, { el: 9, n: 16, w: 16 });
                break;
            case 10:
                this.addAnimation(sprite, { el: 10, n: 16, w: 16 });
                break;
            default:
                break;
        }
    }

    addAnimation(sprite, options) {
        let prefix;
        if (options.el < 10) {
            prefix = 0;
        } else {
            prefix = '';
        }
        sprite.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${prefix}${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${prefix}${options.el}-n-01.png`], 16, true);
        sprite.animations.add(`${options.el}-b`, [`${prefix}${options.el}-b-01.png`], 16, true);
        sprite.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${prefix}${options.el}-w-`, 1, options.w, '.png', 2), 16, false);
    }
}
