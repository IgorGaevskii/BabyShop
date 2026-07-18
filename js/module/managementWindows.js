import {allWindow, window_userAds, window_userTrading} from "./variables.js";
import {closeWindow, openWindow, modalWindow} from './open&closeWindow.js';
import Tab from "./tab.js";
import {panelControl} from "./panel control.js";

export function managementWindows(elem) {
	let sign = elem.dataset.token;

	allWindow.forEach(item => {

		if ( (sign == 'user_advert' && item.classList.contains('user_advert') && !item.classList.contains('hide') ) ||
			  (sign == 'user_trading' && item.classList.contains('user-trading') && !item.classList.contains('hide') ) ){
			return;
		}

		if ( (item.classList.contains('user_advert') && !item.classList.contains('hide') ) || 
			  (item.classList.contains('user-trading') && !item.classList.contains('hide') ) ||
			  (item.classList.contains('favorites') && !item.classList.contains('hide') ) ) {
			let listProdact = item.querySelectorAll('.box');
			listProdact.forEach(item => {
				panelControl.markedImputs = panelControl.getMarkedImputs(item);

				if (panelControl.markedImputs.length > 0) panelControl.deselectImputs(item);
			});
		}

		closeWindow(item);
	});

	let findWindow = Array.from(allWindow).find(item => item.classList.contains(sign));

	if (sign == 'user_advert') {
		let obj_tabUserAdverts = new Tab(window_userAds);
		obj_tabUserAdverts.assignHandler();
	} else if (sign == 'user-trading') {
		let obj_tabUserTrading = new Tab(window_userTrading);
		obj_tabUserTrading.assignHandler();
	}

	openWindow(findWindow);
}