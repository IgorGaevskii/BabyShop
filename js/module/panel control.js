import {window_mainContent, window_userAds, window_userTrading, inputHatActiveAds, inputHatInactiveAds, input_hatMySales, input_hatMyPurchases} from "./variables.js";
import {getAllInput} from "./get all input.js";
import {closeWindow, openWindow} from './open&closeWindow.js';
import collectDataForServer from "./collectDataForServer.js";

export const panelControl = {
	data: {
		// action, описание действия (что необходимо сделать)
		// articles, массив articles с которыми необходимо выполнить действие
	},
	// pressedButton, нажатая кнопка на панели управления

	deselectImputs(elem) {
		this.markedImputs.forEach(item => item.checked = false);

		if (elem.closest('.user_advert')) {
			inputHatActiveAds.checked = false;
			inputHatInactiveAds.checked = false;
		} else if (elem.closest('.user-trading')) {
			input_hatMySales.checked = false;
			input_hatMyPurchases.checked = false;
		} else {
			// убираем галочку с checkbox панели управления избранное
			let input = this.pressedButton.previousElementSibling;
			input.checked = false;
		}
		
	},

	getArticlesGoods() {
		let arr = [];

		this.markedImputs.forEach(item => {
			let parent = item.closest('.card_ad');
			let elemLi = parent.querySelector('ul li.article');
			let articleGoods = elemLi.textContent.slice(5);
			arr.push(articleGoods);
		});
		return arr;
	},

	getAction() {
		let action = this.pressedButton.dataset.action;
		return action;
	},

	getMarkedImputs(listProduct) {

		if (!listProduct) {
			let parentElem = this.pressedButton.closest('.control-panel');
			listProduct = parentElem.nextElementSibling;
		}

		let allInputs = getAllInput(listProduct);

		let arrMarkedInputs = [];
		allInputs.forEach(item => {if (item.checked) arrMarkedInputs.push(item)});
		return arrMarkedInputs;
	},

	checkExistenceMarkedInputs() {

		//получем все маркерованные input
		this.markedImputs = this.getMarkedImputs();

		if (this.markedImputs.length > 1 && this.pressedButton.dataset.action == 'edit') {
			showModalWindow('Необхідно вибрати лише одне оголошення');
			return;
		}

		/*if (this.markedImputs.length >= 0 && this.pressedButton.className == 'content-cross') {
			let parent = this.pressedButton.closest('.content');
			closeWindow(parent);
			openWindow(window_mainContent);

			if (this.markedImputs.length > 0) this.deselectImputs(parent);

			return;
		}*/

		if (!this.markedImputs.length) return;
		this.deselectImputs( this.pressedButton.closest('.content') );

		this.data.action = this.getAction();
		this.data.articles = this.getArticlesGoods();
		collectDataForServer(this.data);
	}
};