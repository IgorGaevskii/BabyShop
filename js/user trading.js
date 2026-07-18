import {window_mainContent, window_userTrading, input_hatMySales, input_hatMyPurchases, allBut_deleteTrading, window_reviewAboutSeller, window_reviewAboutBuyer, window_ask} from "./module/variables.js";
import {panelControl} from "./module/panel control.js";
import manageCheckboxes from "./module/manage checkboxes.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import {openWindow, modalWindow, closeWindow} from "./module/open&closeWindow.js";
import {obj_window_ask} from "./ask.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {createCardGoods} from "./user advert.js";
import showModalWindow from "./module/showModalWindow.js";
import {startSetInterval} from "./module/long query.js";
import {obj_window_chat, createCardGhat} from "./user chat.js";

const but_crossUserTrading = document.querySelector('.user-trading .content-cross')

export let obj_window_trading = {
	data_for_server: {
		action: 'sales',
		articles: [],
	},
	interval: null,

	disableWriteMessageButton(new_remove) {
		let tradingUser = JSON.parse( sessionStorage.getItem('trading') );
		let indexElem = null;
		let findElem = null;
		let register = 0;

		for (let item of new_remove) {
			findElem = tradingUser.find((elem, index) => {
				if (elem.data_goods.article == item.article) {
					indexElem = index;
					return true;
				}
			})

			if (findElem.data_goods.hasOwnProperty('status')) continue;

			findElem.data_goods.status = item.status;
			register++;
		}

		if (register) {
			sessionStorage.removeItem('trading');
			sessionStorage.setItem('trading', JSON.stringify(tradingUser));
			deleteChildNodes( document.querySelector('.sold-goods-list'), document.querySelector('.purchased-goods-list') );
			this.data_for_server.articles.length = 0;
			register = 0;
			createCardTradingUser();
		}
	},

	insertDataSessionStorage(arr) {
		let tradingUser = JSON.parse( sessionStorage.getItem('trading') ) || [];
		let advertsUser = JSON.parse( sessionStorage.getItem('advert') );
		let chatUser = JSON.parse( localStorage.getItem('chat') ) || null;

		arr.forEach(item => {
			tradingUser.push(item);

			let position = advertsUser.findIndex(elem => {

				if (item.data_goods.article == elem.data_goods.article) return true;
			});

			if (position != -1) advertsUser.splice(position, 1);
			//удаляем товар из top
			let window_topCard = document.querySelector('.top-card');
			let allCard_topCard = window_topCard.querySelectorAll('.card');

			if (allCard_topCard.length) {
				let arr_elemCard = Array.from(allCard_topCard);
				let removeElem = arr_elemCard.find(elem => {
					let elemSpan = elem.querySelector('.code-number');
					let codeNumber = elemSpan.textContent;

					if (item.data_goods.article == codeNumber) return true;
				});

				if (removeElem) removeElem.remove();
			}

			//удаляем не нужную переписку из chat (оставляем только между продавцом и покупателем)
			if (chatUser) {
				let position = chatUser.findIndex(elem => elem.data_goods.article == item.data_goods.article);

				if (position != -1) {
					chatUser.splice(position, 1, item);
					localStorage.removeItem('chat');
					localStorage.setItem('chat', JSON.stringify(chatUser));
					obj_window_chat.clearChatWindow();
					obj_window_chat.data_for_server.product.length = 0;
					createCardGhat();
				}
			}
		});

		sessionStorage.removeItem('trading');
		sessionStorage.setItem( 'trading', JSON.stringify(tradingUser) );

		sessionStorage.removeItem('advert');
		if (advertsUser.length) sessionStorage.setItem( 'advert', JSON.stringify(advertsUser));

		deleteChildNodes( document.querySelector('.sold-goods-list'), document.querySelector('.purchased-goods-list'), document.querySelector('.container_active_ads'), document.querySelector('.container_inactive_ads') );
		this.data_for_server.articles.length = 0;
		createCardTradingUser();
		createCardGoods();
	},

	tradingAlwaysQuery() {
		this.interval = setInterval( () => {
			collectDataForServer(this.data_for_server);
		}, 5000);
	},
	
	stopSetInterval() {
		clearInterval(this.interval);
		this.interval = null;
	}
};

export function removeCardTradingUser() {
	obj_window_trading.stopSetInterval();
	let deletedArticles = panelControl.data.articles;
	let advertsTradingUser = JSON.parse( sessionStorage.getItem('trading') );

	deletedArticles.forEach(item => {
		let position = advertsTradingUser.findIndex(elem => item == elem.data_goods.article);
		advertsTradingUser.splice(position, 1);
	});

	sessionStorage.removeItem('trading');
	deleteChildNodes(document.querySelector('.sold-goods-list'), document.querySelector('.purchased-goods-list'));
	obj_window_trading.data_for_server.articles.length = 0;

	if (advertsTradingUser.length) {
		sessionStorage.setItem('trading', JSON.stringify(advertsTradingUser));
		createCardTradingUser();
	} else if ( sessionStorage.getItem('advert') ) {
		let advertsUser = JSON.parse( sessionStorage.getItem('advert') );

		for (let i = 0; i < advertsUser.length; i++) {
			
			if (advertsUser[i].data_goods.display == 'show') {
				obj_window_trading.tradingAlwaysQuery();
				break;
			}
		}
	}
}

export function createCardTradingUser() {
	let containerSales = document.querySelector('.sold-goods-list'),
		containerPurchased = document.querySelector('.purchased-goods-list');

	if ( !sessionStorage.getItem('trading') ) return;

	let tradingUser = JSON.parse(sessionStorage.getItem('trading'));

	if (tradingUser == "" || tradingUser == null) return;

	for (let i = 0; i < tradingUser.length; i++) {
		let {article, title, price, src} = tradingUser[i].data_goods;
		let {id, phone, rating_user, src_avatar, status, user} = tradingUser[i].data_partner;
		let li = document.createElement('li');
		// let input = document.createElement('input');
		// input.type = 'checkbox';
		// li.append(input);

		li.insertAdjacentHTML('beforeend', 
		  `<input type="checkbox">
			<div class="card-trading">
				<img src="${src}" alt="фото" width="90" height="90">
				<ul class="card-data">
					<li><b>${title}</b></li>
					<li class='article'>Арт: ${article}</li>
					<li>Цена: ${price} гр</li>
				</ul>
			</div>
		`);

		let elem_div = document.createElement('div');
		elem_div.className = `data-${status}`;
		elem_div.insertAdjacentHTML('afterbegin', `
			<div class="name-seller">${status == 'seller'? 'Продавець': 'Покупець'}: ${user}</div>
			<div class="rating">
				<div class="rating__stars">
					<div class="rating__active" style="width: ${rating_user / 0.05}%"></div>
				</div>
				<div class="rating__value">${rating_user}</div>
			</div>
			<div className="phone-seller">${phone}</div>`);

		li.append(elem_div);

		let div = document.createElement('div');
		div.className = 'block-button';

		let but_writeMessage = document.createElement('button');
		but_writeMessage.className = 'but-ask';
		but_writeMessage.textContent = 'Написати повідомлення';
		but_writeMessage.setAttribute('data-ask', status == 'seller'? 'seller': 'buyer');
		
		but_writeMessage.onclick = function() {

			if ('status' in tradingUser[i].data_goods) {

				showModalWindow(`Вибачте.<br>Товар ${tradingUser[i].data_goods.status} неможливо написати повідомлення`);
			} else {
				obj_window_ask.checkWindowHidden({article, id_user: id, src_seller: src_avatar, price, src_goods: src, title});
			}
		}
		
		div.append(but_writeMessage);

		let button = document.createElement('button');
		button.className = 'but-review';
		button.textContent = 'Залишити відгук';
		button.setAttribute('data-review-about', status == 'seller'? 'seller': 'buyer');

		button.onclick = function() {
			obj_window_trading.id_review = id;

			if (this.dataset.reviewAbout == 'buyer') {
				modalWindow.open = window_reviewAboutBuyer;
			} else {
				modalWindow.open = window_reviewAboutSeller;
			}
		}
		div.append(button);
		li.append(div);

		if (status == 'seller') {
			li.classList.add('card_ad', 'purchased-goods-item');
			containerPurchased.append(li);
		} else {
			li.classList.add('card_ad', 'sold-goods-item');
			containerSales.append(li);
			obj_window_trading.data_for_server.articles.push(article);
		}
	}
	if (!obj_window_trading.interval) obj_window_trading.tradingAlwaysQuery();
};

[...allBut_deleteTrading].forEach(button => {
	if (button) {
		button.onclick = function() {
			panelControl.pressedButton = this;
			panelControl.checkExistenceMarkedInputs();
		};
	}
});

but_crossUserTrading.onclick = function() {
	closeWindow(window_userTrading);
	openWindow(window_mainContent);
	//убираем галочки с input
	let listProdact = window_userTrading.querySelectorAll('.box');

	listProdact.forEach(item => {
		panelControl.markedImputs = panelControl.getMarkedImputs(item);

		if (panelControl.markedImputs.length > 0) panelControl.deselectImputs(item);
	});
}

if (input_hatMySales) input_hatMySales.onclick = manageCheckboxes;
if (input_hatMyPurchases) input_hatMyPurchases.onclick = manageCheckboxes;