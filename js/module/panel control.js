import {window_mainContent, window_userAds, window_userTrading, inputHatActiveAds, inputHatInactiveAds, input_hatMySales, input_hatMyPurchases} from "./variables.js";
import getAllInput from "./get all input.js";
import {closeWindow, openWindow} from './open&closeWindow.js';
import collectDataForServer from "./collectDataForServer.js";

export const panelControl = {
	data: {},

	deselectImputs(parent) {
		this.markedImputs.forEach(item => item.checked = false);

		if (parent.classList.contains('user_advert')) {
			inputHatActiveAds.checked = false;
			inputHatInactiveAds.checked = false;
		} else {
			input_hatMySales.checked = false;
			input_hatMyPurchases.checked = false;
		}
		
	},

	getArticlesGoods() {
		let arr = [];

		this.markedImputs.forEach(item => {
			// console.log(item)
			let parent = item.closest('.card_ad');
			// console.log(parent)
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

	getMarkedImputs(openWindow) {
		let open_window = openWindow || this.pressedButton.closest('.content');
		let allContentTab = open_window.querySelectorAll('.content_tab');
		let openTab = Array.from(allContentTab).find(item => !item.classList.contains('hide'));
		
		let arr = [];
		let inputs = getAllInput(openTab);
		inputs.forEach(item => {if (item.checked) arr.push(item)});
		return arr;
	},

	checkExistenceMarkedInputs() {
		this.markedImputs = this.getMarkedImputs();

		if (this.markedImputs.length > 1 && this.pressedButton.dataset.action == 'edit') {
			showModalWindow('Необхідно вибрати лише одне оголошення');
			return;
		}

		if (this.markedImputs.length >= 0 && this.pressedButton.className == 'header-cross') {
			let parent = this.pressedButton.closest('.content');
			closeWindow(parent);
			openWindow(window_mainContent);

			if (this.markedImputs.length > 0) this.deselectImputs(parent); //remove the check marks

			return;
		}

		if (!this.markedImputs.length) return;
		this.deselectImputs( this.pressedButton.closest('.content') );

		this.data.action = this.getAction();
		this.data.articles = this.getArticlesGoods();
		collectDataForServer(this.data);
	}
};