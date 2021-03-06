import {model} from "modules/Model/Model";
import {config} from "modules/Util/Config";
import {request} from "../../../../Info/Request";

import {view as fsView} from "modules/States/FS/FSView";
import {view as transitionView} from "modules/Transition/TransitionView";
import Footer from "../../../../Info/Footer";

import {controller as soundController} from "../../../../Info/SoundController";
import {controller as balanceController} from "modules/Balance/BalanceController";
import {controller as panelController} from "modules/Panel/PanelController";
import {controller as rollController} from "modules/Roll/RollController";
import {controller as mobileSetBetController} from "modules/Menu/SetBet/MenuSetBetController";

export let controller = (() => {

	function init(amount) {
		if (model.state('fs:end') === false) return;

		model.state('fs:end', false);
		model.data('fs:count', amount);
		model.updateBalance({startFS: true});

		next();
	}

	function next() {
		let rollData = model.data('rollResponse');

		if (!model.state('fs:end')
			&& rollData.NextMode !== 'root') {
			controller.count({start: true});
			rollController.startRoll();
		}

		if (rollData.NextMode === 'root') {
			stop();
		}
	}

	function count({
		               start,
		               end
	               }) {
		if (start) {
			let newFsCount = model.data('fs:count');
			newFsCount--;
			model.data('fs:count', newFsCount);
			model.el('fs:count').text = newFsCount;
		}
		if (end) {
			model.data('fs:count', model.data('rollResponse').FreeSpinsLeft);
			model.el('fs:count').text = model.data('rollResponse').FreeSpinsLeft;
		}
	}

	function stop() {
		let game = model.el('game');

		let dragonFS = model.el('dragonFS');
		game.time.events.add(400, () => {
			dragonFS.FlyToMain();
		});

		game.time.events.add(2500, () => {
			transitionView.fsFinish();
		});

		model.state('fs:end', true);
		model.updateBalance({endFS: true});
		model.state('fs', false);
	}

	return {
		init,
		next,
		count,
		stop
	};
})();

export class FS {
	constructor(game) {

	}

	init() {
		console.info('FS State!');
		let game = model.el('game');

		// Проверим сохраненную сессию
		this.checkSavedFS();

		// массив в который записываются анимации для проигрывания
		game.frameAnims = [];
		game.spriteAnims = [];


		model.state('fs', true);

		// Создаем контейнеры
		fsView.create.groups({});

		// При выходе из вкладки анимации будут останавливаться
		game.stage.disableVisibilityChange = true;

	}

	create() {
		let game = model.el('game');
		let footer = new Footer({model, soundController, request});
		model.el('footer', footer);

		// Играем фоновую музыку
		soundController.music.stopMusic('startPerehod');
		soundController.music.stopMusic('fon');
		soundController.music.stopMusic('initFon');
		soundController.music.playMusic('fsFon');

		// Отрисовуем основной контейнер
		fsView.draw.mainBG({});
		fsView.draw.mainContainer({});
		fsView.draw.machineContainer({});
		fsView.draw.addDragon({});
		fsView.draw.lineNumbers({});

		// Инициализируем крутки
		rollController.init();

		if (model.mobile) {
			// Рисуем футер
			footer.initMobile();
			// Отрисовуем баланс
			balanceController.initFSMobile();
			mobileSetBetController.init({});
			// Автоматически позиционируем основной контейнер
			this.positionMainContainer();
		} else {    // Desktop
			footer.initFsDesktop();

			// Автоматически позиционируем основной контейнер
			this.positionMainContainer();

			// Рисуем кнопки управления
			panelController.drawFsPanel();
			// Отрисовуем баланс
			balanceController.initFSDesktop();
		}

		// Добавляем маску
		fsView.draw.machineMask({});

		// Рисуем множитель
		fsView.draw.Multi({
			start: this.fsMulti
		});
		// Рисуем счетчик спинов
		fsView.draw.Count({
			start: this.fsCount
		});

		// Первая темнота
		game.camera.flash(0x000000, 500);

		// Запускаем Фри Спины
		game.time.events.add(1000, () => {
			controller.init(this.fsCount);
		});

	}

	update() {
		const game = model.el('game');
		// Обновляем время
		model.el('footer').update();
		// Проигрываем анимацию
		model.el('game').frameAnims.forEach((anim) => {
			anim();
		});

		if (model.mobile && !game.device.iOS) {
			(game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
		}
	}

	positionMainContainer() {
		let game = model.el('game');
		model.group('main').x = game.world.centerX;
		model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
	}

	checkSavedFS() {
		if (model.data('savedFS')) {
			let saved = model.data('savedFS');
			this.fsCount = saved.fsCount;
			this.fsMulti = saved.fsMulti;
			this.fsLevel = saved.fsLevel;
			model.data('savedFS', null);
			model.data('fsMulti', this.fsMulti);
		} else {
			this.fsCount = model.data('rollResponse').FreeSpinsWin;
			this.fsMulti = model.data('rollResponse').NextMode.split('-')[1];
			this.fsLevel = 0;
			model.data('fsMulti', this.fsMulti);
		}
	}

	positionCandles() {
		let game = model.el('game');
		let time = game.rnd.integerInRange(10, 70);
		if (model.desktop) {
			let candle1 = fsView.draw.fsCandle({});
			candle1.scale.set(0.8);
			game.time.events.add(time, () => {
				let candle2 = fsView.draw.fsCandle({x: 62, y: 500});
				candle2.scale.set(0.7);
				let candle3 = fsView.draw.fsCandle({x: 372, y: 440});
			});
		} else {
			let candle1 = fsView.draw.fsCandle({x: -12, y: 315});
			candle1.scale.set(0.8);
			game.time.events.add(time, () => {
				let candle2 = fsView.draw.fsCandle({x: 5, y: 330});
				candle2.scale.set(0.7);
				let candle3 = fsView.draw.fsCandle({x: 164, y: 292});
			});
		}
	}

}
;
