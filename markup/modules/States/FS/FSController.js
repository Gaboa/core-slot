import {model} from "modules/Model/Model";
import {config} from "modules/Util/Config";
import {request} from "../../../../Info/Request";

import {view as fsView} from "modules/States/FS/FSView";
import {view as transitionView} from "modules/Transition/TransitionView";
import {view as winView} from "modules/Win/WinView";
import {view as mainView} from "modules/States/Main/MainView";

import Footer from "../../../../Info/Footer";

import {controller as soundController} from "../../../../Info/SoundController";
import {controller as balanceController} from "modules/Balance/BalanceController";
import {controller as panelController} from "modules/Panel/PanelController";
import {controller as rollController} from "modules/Roll/RollController";
import {controller as mobileSetBetController} from "modules/Menu/SetBet/MenuSetBetController";

export let controller = (() => {

	function stop() {
		let game = model.el('game');

		game.time.events.add(1500, () => {
			soundController.music.stopMusic('fsFon');
			transitionView.fsFinish();
		});

		model.state('fs:end', true);
		model.updateBalance({endFS: true});
		model.state('fs', false);
		// bulletCounter = 0;
	}

	function next() {
		let rollData = model.data('rollResponse');

		if (!model.state('fs:end') && rollData.NextMode !== 'root') {
			controller.count({start: true});
			rollController.startRoll();
		}

		if (rollData.NextMode === 'root') {
			stop();
		}
	}

	function init(amount) {
		if (model.state('fs:end') === false) {
			return;
		}

		model.state('fs:end', false);
		model.data('fs:count', amount);
		model.updateBalance({startFS: true});

		next();
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

	function bullet(el) {
		let game = model.el('game');
		// Проигрываем анимации барабана и +3
		fsView.draw.CountPlus3({});

		// если максимальный множитель достигнут то возвращаемся
		if (model.state('maxFsMultiplier')) {
			return;
		}

		let rollData = model.data('rollResponse');
		let multiValue = rollData.FsBonus.Multi;
		let bulletCounter = rollData.FsBonus.Level % 6;
		let currMulti = model.data('fsMulti');

		// Увеличиваем количество пуль в барабане
		fsView.draw.drumSpin({number: bulletCounter});
		el.visible = true;

		// Увеличиваем мульти(разбивание бутылки)
		if (multiValue > currMulti) {
			fsView.draw.ShowMulti({number: multiValue});
			model.data('fsMulti', multiValue);
			let timer = model.el('fsTimer');
			game.time.events.remove(timer);

			let fsTimer = game.time.events.add(3000, () => {
				if (model.state('fs:end')) {
					return;
				}
				controller.next();
			});

			model.el('fsTimer', fsTimer);
		}

	}

	return {
		init,
		next,
		count,
		stop,
		bullet
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

		fsView.draw.mainBG({});
		// Отрисовуем основной контейнер
		fsView.draw.mainContainer({});
		fsView.draw.machineContainer({});
		mainView.draw.lineNumbers({side: 'left'});
		mainView.draw.lineNumbers({side: 'right'});
		winView.draw.UpWinContainer({});

		// Инициализируем крутки
		rollController.init();

		if (model.mobile) {
			fsView.draw.addPole({});
			// Рисуем футер
			footer.initMobile();
			// Отрисовуем баланс
			balanceController.initFSMobile();
			mobileSetBetController.init({});
			// Автоматически позиционируем основной контейнер
			this.positionMainContainer();
		} else {    // Desktop
			fsView.draw.addCows({});

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

		// Рисуем барабан
		fsView.draw.drum({});
		// Рисуем множитель
		fsView.draw.Multi({
			start: this.fsMulti
		});
		// Рисуем счетчик спинов
		fsView.draw.Count({
			start: this.fsCount
		});

		// Если сохранненая сессия, то переключаем счетчик пуль
		if (this.fsLevel > 0) {
			this.drawRecoveredPanel();
		}

		// Первая темнота
		game.camera.flash(0x000000, 500);

		// Запускаем Фри Спины
		game.time.events.add(1000, () => {
			controller.init(this.fsCount);
		});

	}

	update() {
		const game = model.el('game');
		// Обновляем футер
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
		// model.group('main').x = (model.desktop) ? game.world.centerX : game.width - model.group('main').width / 2;
		model.group('main').x = game.world.centerX + 8;
		model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
	}

	drawRecoveredPanel() {
		fsView.draw.drumSpin({
			number: this.fsLevel % 6,
			multiValue: this.fsMulti
		});

		switch (model.data('fsMulti')) {
			case 8:
				fsView.draw.recoverBottles(8);
			case 6:
				fsView.draw.recoverBottles(6);
			case 4:
				fsView.draw.recoverBottles(4);
				break;
			default:
				return;
		}
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
			this.fsCount = 15;
			this.fsMulti = 2;
			this.fsLevel = 0;
			model.data('fsMulti', 2);
		}
	}

}
