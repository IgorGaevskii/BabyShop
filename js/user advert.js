import {window_userAds, inputHatActiveAds, inputHatInactiveAds, window_mainContent} from "./module/variables.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import {panelControl} from "./module/panel control.js" ;
import manageCheckboxes from "./module/manage checkboxes.js";
import {getAllInput} from "./module/get all input.js";
import {obj_window_trading} from "./user trading.js";
import {interval, startSetInterval, stopSetInterval} from "./module/long query.js";
import {obj_window_chat} from "./user chat.js";
import {closeWindow, openWindow} from './module/open&closeWindow.js';

const header = document.querySelector('header'),
	fieldSet = document.querySelector('fieldset'),
	containerActiveAds = document.querySelector('.container_active_ads'),
	containerInactiveAds = document.querySelector('.container_inactive_ads'),
	but_crossUserAds = document.querySelector('.user_advert .content-cross'),
	but_displayAdvert = document.querySelectorAll('.but_display_advert'),
	but_editAdvert = document.querySelectorAll('.but_edit_advert'),
	but_deleteAdvert = document.querySelector('.but_delete_advert'),
	elem_addAdvertSubcategory = document.querySelector('.addAdvert_subcategory');

function checkStorage(advertsUser) {
	//если в хранилище все товары hide то отключаем запросы куплено, чат к базе
	let findElem = advertsUser.find(item => item.data_goods.display == 'show');

	if (!findElem) {
		stopSetInterval();
		obj_window_trading.stopSetInterval();
	} else {
		//запускаем отслеживание продаж
		if (!obj_window_trading.interval) obj_window_trading.tradingAlwaysQuery();

		//запускаем отслеживание переписки
		if (!interval) startSetInterval(obj_window_chat.data_for_server);
	}
}

export function deleteCardGoods() {
	let deletedArticles = panelControl.data.articles;
	let advertsUser = JSON.parse(sessionStorage.getItem('advert'));

	deletedArticles.forEach(item => {
		let position = advertsUser.findIndex(elem => item == elem.data_goods.article);
		advertsUser.splice(position, 1);
	});

	sessionStorage.removeItem('advert');
	deleteChildNodes(containerActiveAds, containerInactiveAds);

	if (advertsUser.length) {
		sessionStorage.setItem('advert', JSON.stringify(advertsUser));
		createCardGoods();
		manageCheckboxes.call(inputHatInactiveAds);
	} else {
		obj_window_trading.stopSetInterval();

		if ( !localStorage.getItem('chat') ) {
			stopSetInterval();
			obj_window_chat.data_for_server.product.length = 0;
		}
	}
}

export function createCardGoods() {

	if ( !sessionStorage.getItem('advert') ) return;

	let advertsUser = JSON.parse(sessionStorage.getItem('advert'));

	if (advertsUser == "" || advertsUser == null) return;

	for (let i = 0; i < advertsUser.length; i++) {
		let div = document.createElement('div');
		div.className = 'card_ad';

		let input = document.createElement('input');
		input.type = 'checkbox';

		input.onclick = function() {
			let boxAds = this.closest('.box');
			let inputHat = boxAds.previousElementSibling.querySelector('input');

			if (!this.checked && inputHat.checked) {
				inputHat.checked = false;
			} else {
				
				for (let elem of boxAds.querySelectorAll('input')) {

					if (!elem.checked) return;
				}
				
				inputHat.checked = true;
			}
		}

		div.append(input);
		div.insertAdjacentHTML('beforeend', 
			`<img src="${advertsUser[i].data_goods.src}" alt="фото" width="90" height="90">
				<ul class='card-data'>
					<li><b>${advertsUser[i].data_goods.title}</b></li>
					<li class='article'>Арт: ${advertsUser[i].data_goods.article}</li>
					<li>Цена: ${advertsUser[i].data_goods.price} грн</li>
					<li>Продолжительность: ${advertsUser[i].data_goods.time_display} дней</li>
				</ul>
		`);
			
		advertsUser[i].data_goods.display == 'show'?
		containerActiveAds.append(div):
		containerInactiveAds.append(div);
	}

	checkStorage(advertsUser);
}

export function changeDisplayAdverts() {
	let advertsUser = JSON.parse(sessionStorage.getItem('advert'));

	for (let article of panelControl.data.articles) {
		let index = advertsUser.findIndex(item => article == item.data_goods.article);

		if (panelControl.data.action == 'deactivate') {
			advertsUser[index].data_goods.display = 'hide';

			//если в топе существует товар то удаляем с экрана
			if ( window_mainContent.classList.contains('top-card') ) {
				let allCard = window_mainContent.querySelectorAll('.card');

				allCard.forEach(item => {
					let elem = item.querySelector('span.code-number');
					let code = elem.textContent;

					if (code == article) item.remove();
				})
			}
		} else {
			advertsUser[index].data_goods.display = 'show';

			if (window_mainContent.classList.contains('top-card') && advertsUser[index].data_goods.top == '1') {
				window_mainContent.insertAdjacentHTML('beforeend', 
					`<div class='card'>
						<img src='${advertsUser[index].data_goods.src}' width='230' height='230'>
						<p class="card__name">${advertsUser[index].data_goods.title}</p>
						<p class="card__code">Код товара: <span class="code-number">${advertsUser[index].data_goods.article}</span></p>
						<p class="card__price">Цена: ${advertsUser[index].data_goods.price} гр</p>
					</div>`);
			}
		}
	}

	sessionStorage.removeItem('advert');
	let adsUser = JSON.stringify(advertsUser);
	sessionStorage.setItem('advert', adsUser);

	deleteChildNodes(containerActiveAds, containerInactiveAds);
	createCardGoods();

	panelControl.data.action == 'deactivate'? 
	manageCheckboxes.call(inputHatActiveAds):
	manageCheckboxes.call(inputHatInactiveAds);
	panelControl.data.obj = null;	
}

function init() {
	if (elem_addAdvertSubcategory) {
		elem_addAdvertSubcategory.disabled = true;
	}
}

async function exchangeData(formData, obj, url) {
	let response = await fetch(url, {
		method: 'POST',
		body: formData
	});

	if (response.ok) { //проверяем статус ответа сервера
		let answerServer = await response.json(); //получаем ответ сервера
		console.log(`Answer server:`);
		console.log(answerServer);
		
		if (answerServer.status == 'success') {

			switch (answerServer.action) {
				
				
			}
		} else {
			alert('fiasco');
		}
	}
};

// Функция для добавления обработчика событий
[...but_displayAdvert, ...but_editAdvert, but_deleteAdvert].forEach(item => {
	item.onclick = function() {
		panelControl.pressedButton = this;//file panel control.js
		panelControl.checkExistenceMarkedInputs();//file panel control.js
	}
})

but_crossUserAds.onclick = function() {
	closeWindow(window_userAds);
	openWindow(window_mainContent);
	//убираем галочки с input
	let listProdact = window_userAds.querySelectorAll('.box');

	listProdact.forEach(item => {
		panelControl.markedImputs = panelControl.getMarkedImputs(item);

		if (panelControl.markedImputs.length > 0) panelControl.deselectImputs(item);
	});
}

if (inputHatActiveAds) {
    inputHatActiveAds.onclick = manageCheckboxes;
}
if (inputHatInactiveAds) {
    inputHatInactiveAds.onclick = manageCheckboxes;
}

init();