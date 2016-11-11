import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawMobileFooter({
        color = 0x000000,
        heightTop = 40,
        heightBottom = 30,
        alphaTop = 0.25,
        alphaBottom = 0.7
    }) {
        const game = model.el('game');

        let footerContainer = game.add.group();
        model.group('footer', footerContainer);

        let footerTop = game.add.graphics(0, 0, footerContainer)
        .beginFill(color, alphaTop).drawRect(
            0,
            game.height - (heightTop + heightBottom),
            game.width,
            heightTop
        );
        model.el('footerTop', footerTop);

        let footerBottom = game.add.graphics(0, 0, footerContainer)
            .beginFill(color, alphaBottom).drawRect(
                0,
                game.height - heightBottom,
                game.width,
                heightBottom
            );
        model.el('footerBottom', footerBottom);

        model.data('footerTopCenterY', game.height - (heightBottom + heightTop / 2));
        model.data('footerBottomCenterY', game.height - heightBottom / 2);

    }

    function drawDesktopFooter({
        color = 0x000000,
        heightBottom = 30,
        alphaBottom = 0.7
    }) {
        const game = model.el('game');

        let footerContainer = game.add.group();
        model.group('footer', footerContainer);

        let footerBottom = game.add.graphics(0, 0, footerContainer)
            .beginFill(color, alphaBottom).drawRect(
                0,
                game.height - heightBottom,
                game.width,
                heightBottom
            );
        model.el('footerBottom', footerBottom);

        model.data('footerBottomCenterY', game.height - heightBottom / 2);
    }

    function drawHomeButton({
        x = 25,
        y = model.el('game').height - 15,
        container = model.group('footer')
    }) {
        const game = model.el('game');
        const homeButton = game.add.button(x, y, 'footerButtons', null, null, 'homeOn.png', 'home.png', 'homeOn.png', null, container);
        homeButton.anchor.set(0.5);
        model.el('homeButton', homeButton);
        return homeButton;
    }

    function drawMenuButton({
        x = 75,
        y = model.el('game').height - 15,
        container = model.group('footer')
    }) {
        const game = model.el('game');
        const menuButton = game.add.button(x, y, 'footerButtons', null, null, 'menuOn.png', 'menu.png', 'menuOn.png', null, container);
        menuButton.anchor.set(0.5);
        model.el('menuButton', menuButton);
        return menuButton;
    }

    function drawSoundButton({
        x = 125,
        y = model.el('game').height - 15,
        container = model.group('footer')
    }) {
        const game = model.el('game');
        const soundButton = game.add.button(x, y, 'footerButtons', null, null, 'soundOn.png', 'sound.png', null, null, container);
        soundButton.anchor.set(0.5);
        model.el('soundButton', soundButton);
        return soundButton;
    }

    function drawFastButton({
        x = 175,
        y = model.el('game').height - 15,
        container = model.group('footer')
    }) {
        const game = model.el('game');
        const fastButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fastSpinOff.png', null, null, container);
        fastButton.anchor.set(0.5);
        model.el('fastButton', fastButton);
        return fastButton;
    }

    function drawTime({
        container = model.group('footer'),
        styleDesktop = {font: '18px Helvetica, Arial', align: 'center'},
        styleMobile = {font: '22px Helvetica, Arial', align: 'center'},
        color = '#e8b075'
    }) {
        const game = model.el('game');

        let currentHour = new Date().getHours();
        let currentMinutes = new Date().getMinutes();

        if (currentHour < 10) {
            currentHour = '0' + currentHour;
            model.data('currentHour', currentHour);
        }
        if (currentMinutes < 10) {
            currentMinutes = '0' + currentMinutes;
            model.data('currentMinutes', currentMinutes);
        }

        let style;

        if (model.state('desktop')) {
            style = styleDesktop;
        }

        if (model.state('mobile')) {
            style = styleMobile;
        }

        let footerTime = game.add.text(
            0,
            game.height - 12,
            `${currentHour} : ${currentMinutes}`,
            style,
            container);
        footerTime.anchor.set(0.5);
        footerTime.x = game.width - footerTime.width;
        footerTime.fill = color;

        model.el('footerTime', footerTime);

    }

    function updateTime() {
        let footerTime = model.el('footerTime');
        let currentHour = model.el('currentHour');
        let currentMinutes = model.el('currentMinutes');

        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
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

    return {
        drawMobileFooter,
        drawDesktopFooter,
        drawHomeButton,
        drawMenuButton,
        drawSoundButton,
        drawFastButton,
        drawTime,
        updateTime
    }

})();