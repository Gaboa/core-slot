import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        Container: function() {
            const game = model.el('game');
            let container = game.add.group();
            if (model.state('side') === 'left') {
                container.x = game.world.width;
            } else {
                container.x = -container.x;
            }
            model.el('settingsContainer', container);
            return container;
        },

        Overlay: function({
            container = model.el('settingsContainer'),
            color = 0x000000,
            alpha = 0
        }) {
            const game = model.el('game');
            let overlay = game.add.graphics(0, 0)
                .beginFill(color)
                .drawRect(0, 0, game.width, game.height);
            overlay.alpha = alpha;
            overlay.visible = false;
            model.el('settingsOverlay', overlay);
            return overlay;
        },

        BG: function({
            container = model.el('settingsContainer'),
            widthPercentage = 0.22,
            color = 0x000000
        }) {
            const game = model.el('game');
            const menuBG = game.add.graphics(0, 0, container)
                .beginFill(color)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('settingsBG', menuBG);
            return menuBG;
        },

        Border: function({
            container = model.el('settingsContainer'),
            color = 0xffffff,
            alpha = 0.3,
            widthPercentage = 0.002
        }) {
            const game = model.el('game');
            const menuBorder = game.add.graphics(0, 0, container)
                .beginFill(color, alpha)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('settingsBorder', menuBorder);
            return menuBorder;
        },

        Title: function({
            container = model.el('settingsContainer'),
            heightPercentage = 0.07,
            text = 'SETTINGS',
            style = {font: 'bold 40px Arial', fill: '#fff', align: 'center'}
        }) {
            const game = model.el('game');
            const settingsTitle = game.add.text(
                container.width / 2,
                game.height * heightPercentage,
                text,
                style,
                container);
            settingsTitle.anchor.set(0.5);
            model.el('settingsTitle', settingsTitle);
            return settingsTitle;
        },

        BackButton: function({
            container = model.el('settingsContainer'),
            heightPercentage = 0.9
        }) {
            const game = model.el('game');
            const backButton = game.add.sprite(container.width / 2, game.world.height * heightPercentage, 'mobileButtons', 'return.png', container);
            backButton.anchor.set(0.5);
            model.el('settingsBackButton', backButton);
            return backButton;
        }

    };

    let show = {

        Settings: function({
            container = model.el('settingsContainer'),
            time = 700
        }) {
            const game = model.el('game');
            if (model.state('side') === 'left') {
                container.x = game.width;
                return game.add.tween(container).to( { x: game.width - container.width }, time, 'Quart.easeOut', true);
            } else {
                container.x = -container.width;
                return game.add.tween(container).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function({
            finalAlpha = 0.5,
            time = 700
        }) {
            const game = model.el('game');
            let overlay = model.el('settingsOverlay');
                overlay.alpha = 0;
                overlay.visible = true;
            return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true);
        }

    };

    let hide = {

        Settings: function({
            container = model.el('settingsContainer'),
            time = 700
        }) {
            const game = model.el('game');
            if (model.state('side') === 'left') {
                return game.add.tween(container).to( { x: game.width }, time, 'Quart.easeOut', true);
            } else {
                return game.add.tween(container).to( { x: -container.width }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function({
            time = 700
        }) {
            const game = model.el('game');
            let overlay = model.el('settingsOverlay');
            return game.add.tween(overlay).to( { alpha: 0 }, time, 'Quart.easeOut', true)
        }

    };

    return {
        draw,
        show,
        hide
    };
})();
