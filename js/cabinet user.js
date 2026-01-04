import {allWindow, window_mainContent, window_userAds, window_userTrading, elem_soldGoodsList, elem_purchasedGoodsList, window_ask, window_chat, window_cabinet, elem_numberNewMessages, elemUl_listGoods_chat} from "./module/variables.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import sendQuery from "./module/sendQuery.js";
import {closeWindow, openWindow, modalWindow} from './module/open&closeWindow.js';
import Tab from "./module/tab.js";
import {obj_window_ask} from "./ask.js";
import {panelControl} from "./module/panel control.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {obj_window_trading} from "./user trading.js";
import {obj_window_chat} from "./user chat.js";
import {interval, stopSetInterval} from "./module/long query.js";

const but_outCabinet = document.getElementById('but-out-cabinet'),
	window_authorization = document.getElementById('authorization'),
	window_newAd = document.querySelector('.new_advert'),
	userName = document.getElementById('user-name'),
	containerActiveAds = document.querySelector('.container_active_ads'),
	containerInactiveAds = document.querySelector('.container_inactive_ads');

//Out from cabinet
but_outCabinet.onclick = () => {
	allWindow.forEach(item => closeWindow(item));

	if (interval) stopSetInterval();

	if (obj_window_trading.interval) {
		obj_window_trading.data_for_server.articles.length = 0;
		obj_window_trading.stopSetInterval();
	}

	if ( window_ask.classList.contains('show-ask') ) obj_window_ask.hideWindowAsk();

	if ( !elem_numberNewMessages.classList.contains('hide') ) {
		elem_numberNewMessages.classList.add('hide');
		elem_numberNewMessages.textContent = '';
		// obj_window_chat.total_new_message = 0;
	}

	if (window_mainContent) openWindow(window_mainContent);
	
	window_authorization.style.transform = "";
	window_cabinet.style.transform = "";
	sessionStorage.clear();
	localStorage.clear();
	deleteChildNodes(userName, containerActiveAds, containerInactiveAds, elem_soldGoodsList, elem_purchasedGoodsList, elemUl_listGoods_chat);
	obj_window_chat.clearChatWindow();
	obj_window_chat.data_for_server.product.length = 0;

	collectDataForServer('exit cabinet');
}

document.getElementById('cabinet-menu').addEventListener('click', (event) => {
	let target = event.target;

	if (target.tagName != 'LI') return;

	let sign = target.dataset.token;

	allWindow.forEach(item => {

		if ( (sign == 'user_advert' && item.classList.contains('user_advert') && !item.classList.contains('hide') ) ||
			  (sign == 'user_trading' && item.classList.contains('user-trading') && !item.classList.contains('hide') ) ){
			return;
		}

		if ( (item.classList.contains('user_advert') && !item.classList.contains('hide') ) || 
			  (item.classList.contains('user-trading') && !item.classList.contains('hide') ) ) {
			panelControl.markedImputs = panelControl.getMarkedImputs(item);

			if (panelControl.markedImputs.length > 0) panelControl.deselectImputs(item);
		}

		closeWindow(item);
	});
	
	if ( sign == 'new_advert') {
		// closeWindow(elem_wrapperCard);//Function is in the file advert.js
		openWindow(window_newAd);
	} else if (sign == 'user_advert') {
		let obj_tabUserAdverts = new Tab(window_userAds);
		obj_tabUserAdverts.assignHandler();
		openWindow(window_userAds);
	} else if (sign == 'user_trading') {
		let obj_tabUserTrading = new Tab(window_userTrading);
		obj_tabUserTrading.assignHandler();
		openWindow(window_userTrading);
	} else if (sign == 'chat') {
		openWindow(window_chat);
	}
});