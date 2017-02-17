import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        MobileFooter: function({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightTop = 40,
            heightBottom = 30,
            alphaTop = 0.25,
            alphaBottom = 0.7
        }) {

            let footerTop = game.add.graphics(0, 0, container)
                .beginFill(color, alphaTop).drawRect(
                    0,
                    game.height - (heightTop + heightBottom),
                    game.width,
                    heightTop
                );
            model.el('footerTop', footerTop);

            let footerBottom = game.add.graphics(0, 0, container)
                .beginFill(color, alphaBottom).drawRect(
                    0,
                    game.height - heightBottom,
                    game.width,
                    heightBottom
                );
            model.el('footerBottom', footerBottom);

            model.data('footerTopCenterY', game.height - (heightBottom + heightTop / 2));
            model.data('footerBottomCenterY', game.height - heightBottom / 2);

        },

        DesktopFooter: function({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightBottom = 50,
            alphaBottom = 0.7
        }) {

            let footerBottom = game.add.graphics(0, 0, container)
                .beginFill(color, alphaBottom).drawRect(
                    0,
                    game.height - heightBottom,
                    game.width,
                    heightBottom
                );
            model.el('footerBottom', footerBottom);

            model.data('footerBottomCenterY', game.height - heightBottom / 2 + 3);
        },

        HomeButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            if (model.mobile) {
                y = model.el('game').height - 17;
            }
            let homeButton = game.add.button(x, y, 'footerButtons', null, null, 'homeOn.png', 'home.png', 'homeOn.png', null, container);
            homeButton.anchor.set(0.5);
            // homeButton.visible = false;
            model.el('homeButton', homeButton);
            return homeButton;
        },

        SoundButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 80,
            y = model.el('game').height - 20
        }) {
            let soundButton = game.add.button(x, y, 'footerButtons', null, null, 'sound.png', null, null, null, container);
            soundButton.anchor.set(0.5);
            // soundButton.visible = false;
            // Определяем начальный фрейм
            if (model.state('globalSound')) {
                soundButton.frameName = 'sound.png';
            } else {
                soundButton.frameName = 'soundOff.png';
            }
            model.el('soundButton', soundButton);
            return soundButton;
        },

        FullScreenButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 130,
            y = model.el('game').height - 20
        }) {
            let fullScreeButton = game.add.button(x, y, 'footerButtons', null, null, 'fullscreen.png', 'fullscreenOff.png', 'fullscreen.png', null, container);
            fullScreeButton.anchor.set(0.5);
            // fullScreeButton.visible = false;

            model.el('fullScreeButton', fullScreeButton);
            return fullScreeButton;
        },

        SettingsButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 180,
            y = model.el('game').height - 20
        }) {
            let settingsButton = game.add.button(x, y, 'footerButtons', null, null, 'settingsOn.png', 'settings.png', 'settingsOn.png', null, container);
            settingsButton.anchor.set(0.5);
            // settingsButton.visible = false;

            model.el('settingsButton', settingsButton);
            return settingsButton;
        },

        FastButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 230,
            y = model.el('game').height - 20
        }) {
            let fastButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fastSpin.png', null, null, container);
            fastButton.anchor.set(0.5);
            // fastButton.visible = false;
            fastButton.frameName = (model.state('fastRoll')) ? 'fastSpinOff.png' : 'fastSpin.png';

            model.el('fastButton', fastButton);
            return fastButton;
        },

        InfoButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 280,
            y = model.el('game').height - 20
        }) {
            let infoButton = game.add.button(x, y, 'footerButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
            infoButton.anchor.set(0.5);
            // infoButton.visible = false;

            model.el('infoButton', infoButton);
            return infoButton;
        },

        _markers: function (container) {
            let game = model.el('game');

            let infoMarkers = [];
            let infoMarker = game.add.sprite(60, 0, 'infoMarker', 'marker_on.png', container);
            let numberOfInfoImages = game.cache._cache.image.infoTable.frameData._frames.length;
            infoMarker.anchor.set(0.5);
            infoMarker.name = 'infoMarker0';
            infoMarkers.push(infoMarker);

            for (let i = 1; i < numberOfInfoImages; i++) {
                let name = 'infoMarker' + i;
                let marker = game.add.sprite(infoMarker.x, 0, 'infoMarker', 'marker_off.png', container);
                marker.name = name;
                marker.anchor.set(0.5);
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }

            model.el('infoMarkers', infoMarkers);
        },

        _arrows: function (container) {
            let game = model.el('game');
            let infoMarkers = model.el('infoMarkers');

            let arrowRight = game.add.sprite(infoMarkers[infoMarkers.length - 1].x + 50, 85, 'arrow', null, container);
            arrowRight.anchor.set(0.5);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(infoMarkers[0].x - 50, 85, 'arrow', null, container);
            arrowLeft.anchor.set(0.5);
            arrowLeft.scale.set(-1, 1);
            model.el('arrowLeft', arrowLeft);
        },

        info: function ({
            game = model.el('game'),
            container = model.group('infoTable'),
            x = model.el('game').world.centerX,
            y = model.el('game').world.centerY,
        }) {
            container.visible = false;
            container.alpha = 0;
            let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.7).drawRect(0, 0, game.width, game.height);
            model.el('overlay', overlay);

            let infoTableBg = game.add.sprite(x, y, 'infoTableBg', null, container);
            infoTableBg.anchor.set(0.5);
            infoTableBg.scale.set((model.desktop) ? 1.3 : 1);
            model.el('infoTableBg', infoTableBg);

            let infoTable = game.add.sprite(x, y, 'infoTable', '1_en.png', container);
            infoTable.anchor.set(0.5);
            infoTable.scale.set((model.desktop) ? 1.3 : 1);
            model.el('infoTable', infoTable);

            let closeButton = game.add.sprite(game.width - 170, 120, 'closeButton', null, container);
            closeButton.right = infoTableBg.right + 3;
            closeButton.top = infoTableBg.top + 3;
            model.el('closeButton', closeButton);

            let infoControllers = game.add.group();

            draw._markers(infoControllers);
            draw._arrows(infoControllers);

            infoControllers.y = infoTableBg.bottom - infoControllers.height / 2 - 30;
            infoControllers.x = game.width / 2 - infoControllers.width / 2 + 50;

            container.add(infoControllers);
            model.group('infoControllers', infoControllers);
        },

        Time: function({
            game = model.el('game'),
            container = model.group('footer'),
            styleDesktop = {
                font: '18px Helvetica, Arial',
                align: 'center',
                fill: '#e8b075'
            },
            styleMobile = {
                font: '22px Helvetica, Arial',
                align: 'center',
                fill: '#e8b075'
            }
        }) {
            let currentHour = new Date().getHours();
            let currentMinutes = new Date().getMinutes();

            if (currentHour < 10) {
                currentHour = `0${currentHour}`;
                model.data('currentHour', currentHour);
            }
            if (currentMinutes < 10) {
                currentMinutes = `0${currentMinutes}`;
                model.data('currentMinutes', currentMinutes);
            }

            let style;

            if (model.desktop) {
                style = styleDesktop;
            }

            if (model.mobile) {
                style = styleMobile;
            }

            let footerTime = game.add.text(
                0,
                game.height - 18,
                `${currentHour} : ${currentMinutes}`,
                style,
                container);
            footerTime.anchor.set(0.5);
            footerTime.x = game.width - footerTime.width;

            model.el('footerTime', footerTime);

        }

    };

    let update = {

        Time: function() {
            let footerTime = model.el('footerTime');
            let currentHour = model.el('currentHour');
            let currentMinutes = model.el('currentMinutes');

            let hours = new Date().getHours();
            let minutes = new Date().getMinutes();

            if (hours < 10) {
                hours = `0${hours}`;
            }
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }

            if (currentHour !== hours) {
                currentHour = hours;
                footerTime.text = `${currentHour} : ${currentMinutes}`;
            }

            if (currentMinutes !== minutes) {
                currentMinutes = minutes;
                footerTime.text = `${currentHour} : ${currentMinutes}`;
            }

        }

    };

    return {
        draw,
        update
    };

})();
