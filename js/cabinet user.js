import {allWindow, window_mainContent, elem_soldGoodsList, elem_purchasedGoodsList, window_ask, window_cabinet, elem_numberNewMessages, elemUl_listGoods_chat} from "./module/variables.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import {closeWindow, openWindow} from './module/open&closeWindow.js';
import {obj_window_ask} from "./ask.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {obj_window_trading} from "./user trading.js";
import {obj_window_chat} from "./user chat.js";
import {interval, stopSetInterval} from "./module/long query.js";
import {managementWindows} from "./module/managementWindows.js";

const but_outCabinet = document.getElementById('but-out-cabinet'),
	allLi = window_cabinet.querySelectorAll('li'),
	window_authorization = document.getElementById('authorization'),
	window_newAd = document.querySelector('.new_advert'),
	userName = document.getElementById('user-name'),
	containerActiveAds = document.querySelector('.container_active_ads'),
	containerInactiveAds = document.querySelector('.container_inactive_ads');

allLi.forEach(item => {
	item.onclick = function() {
		managementWindows(this);
	}
})

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