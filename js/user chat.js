import {window_ask, window_chat, window_mainContent, but_crossChat,  elemUl_listGoods_chat, elemUL_listPartners_chat, elemDiv_headingInfoGoods_chat, elemDiv_headingInfoUser_chat, elem_numberNewMessages, elemUL_message, form_sendMessage, elemTextarea_chat, elemBut_sendMessage_chat, elemDiv_messagesScreen} from "./module/variables.js";
import {closeWindow, openWindow} from "./module/open&closeWindow.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {interval, startSetInterval, stopSetInterval} from "./module/long query.js";
import clearFieldsForm from "./module/clearFieldsForm.js";
import {obj_window_ask} from "./ask.js";
import {panelControl} from "./module/panel control.js";

export let obj_window_chat = {
	data_for_server: {
		action: 'chat',
		product: [], //массив данных для получения колличества новых сообщений по товарам
		//article: article of goods for correspondence
		//id_partner: property of interlocutor's id
		//visitors: свойство для проверки статуса активный неактивный
	},
	listPartners: [],
	lengthCorrespondence: 0,

	toggleLockIconInStorage(obj) {
		console.group('toggleLockIconInStorage');
		console.log(obj);
		let but = elemDiv_headingInfoUser_chat.querySelector('.but-block-user');
		console.log(but);
		deleteChildNodes(but);
		but.removeAttribute('data-action');

		if (obj.action == 'block user') {
			but.title = 'Розблокувати';
			but.setAttribute('data-action', 'unblock user');
			but.innerHTML = '<img src="pictures/unblock user.png" alt="icon unblock user" width="25" height="25">';
		} else {
			but.title = 'Зблокувати';
			but.setAttribute('data-action', 'block user');
			but.innerHTML = '<img src="pictures/block user.png" alt="icon block user" width="25" height="25">';
		}

		let userСhats = JSON.parse( localStorage.getItem('chat') );
		let goods = userСhats.find(item => item.data_goods.article == obj.article);
		console.log(goods);
		let partner = goods.data_partner.find(item => item.id == obj.id_partner);
		console.log(partner);

		if ('seller_ratio' in obj) partner.seller_ratio = obj.seller_ratio;

		if ('buyer_ratio' in obj) partner.buyer_ratio = obj.buyer_ratio;

		localStorage.removeItem('chat');
		localStorage.setItem( 'chat', JSON.stringify(userСhats) );
		console.groupEnd();
	},

	removeChat(article) {
		stopSetInterval();

		let deletedArticles = article || panelControl.data.articles;
		let userСhats = [];

		if ( localStorage.getItem('chat') ) {
			userСhats = JSON.parse( localStorage.getItem('chat') );

			deletedArticles.forEach(item => {
				let position = userСhats.findIndex(elem => item == elem.data_goods.article);
				
				if (position != -1) userСhats.splice(position, 1);
				//если в момент удаления продажи велась переписка через чат удаляем данные с data_for_server
				if ('article'in this.data_for_server && this.data_for_server.article == item) this.clearChatWindow(); 
			});
		}

		localStorage.removeItem('chat');
		this.data_for_server.product.length = 0;

		if (userСhats.length) {
			localStorage.setItem( 'chat', JSON.stringify(userСhats) );
			createCardGhat();
		} else {
			this.clearChatWindow();

			if (elemUl_listGoods_chat.firstElementChild) deleteChildNodes(elemUl_listGoods_chat);

			if ( sessionStorage.getItem('advert') ) {
				let advertsUser = JSON.parse( sessionStorage.getItem('advert') );

				for(let i = 0; i < advertsUser.length; i++) {
					
					if (advertsUser[i].data_goods.display == 'show') {
						startSetInterval(obj_window_chat.data_for_server);
						break;
					}
				}
			}
		}
	},

	addNewPartner(arr) {
		console.log(arr)
		/*входные данные
			new_partner: [
				0: {	article: "2041",
						data_partner: {	id: '3',
												user: 'Юля Плотницкая',
												phone: '+38(098)632-12-36',
												src_avatar: '/pictures/user avatars/XjbzcHFtcgWTvKanVpkZ.jpg'
											}
					}
			]
		*/

		let chatUser = JSON.parse(localStorage.getItem('chat'));

		arr.forEach(elem => {
			let chat = chatUser.find(item => item.data_goods.article == elem.article);
			chat.data_partner.push(elem.data_partner);

			if (!window_chat.classList.contains('hide') && this.data_for_server.article == elem.article) {
				this.listPartners.push(elem.data_partner);
				let currentProduct = this.data_for_server.product.find(point => point[0] == elem.article);
				currentProduct[1].push(elem.data_partner.id);
				let arr_tmp = [];
				arr_tmp[0] = elem.data_partner;
				createCardUsers(arr_tmp);
			} else if (!window_chat.classList.contains('hide') && this.data_for_server.article != elem.article) {
				let currentProduct = this.data_for_server.product.find(point => point[0] == elem.article);
				currentProduct[1].push(elem.data_partner.id);

				let allLi = elemUl_listGoods_chat.querySelectorAll('.item-list-goods');
				let elemLi = Array.from(allLi).find(item => item.dataset.article == elem.article);
				elemLi.onclick = () => {changeAppearanceWindow(chat)}
			}
		})
	
		localStorage.removeItem('chat');
		localStorage.setItem( 'chat', JSON.stringify(chatUser) );

		if ( window_chat.classList.contains('hide') ) {
			this.data_for_server.product.length = 0;
			stopSetInterval();
			createCardGhat();
		}
	},

	showNewMessageGoods(arr) {
		let total_new_message = 0;

		for (let item of arr) {
			let sum_new_message = 0;

			// if (window_ask.classList.contains('show-ask') && obj_window_ask.data_for_server.article == item[0]) continue;

			for (let a of item[1]) {
				sum_new_message += a.num_message
			}
			let allElementsli_itemListGoods = Array.from( elemUl_listGoods_chat.querySelectorAll('li') );
			let elemLI_itemListGoods = allElementsli_itemListGoods.find(li => li.dataset.article == item[0]);
			let indicatorMessages = elemLI_itemListGoods.querySelector('.indicator-messages');

			if (sum_new_message && 
				item[0] != obj_window_ask.data_for_server.article && 
				item[0] != this.data_for_server.article) {
				indicatorMessages.classList.remove('hide');
				indicatorMessages.textContent = sum_new_message;
				total_new_message += sum_new_message;
			} else {
				indicatorMessages.classList.add('hide');
				indicatorMessages.textContent = '';
			}
			// total_new_message += sum_new_message;
		}

		if (total_new_message) {
			elem_numberNewMessages.classList.remove('hide');
			elem_numberNewMessages.textContent = total_new_message;
		} else {
			elem_numberNewMessages.classList.add('hide');
			elem_numberNewMessages.textContent = '';
		}

		if (elemUL_listPartners_chat.firstElementChild) {
			let arr_partner = arr.find(item => item[0] == this.data_for_server.article);
			this.showActiveInterlocutors(arr_partner[1]);
			this.showNumberNewMessage(arr_partner[1]);
			this.visitors = arr_partner[1];
		}
	},

	getListGoods(array) {
		console.log(array);
		if (interval) stopSetInterval();

		let arr_tmp = [];
		let addGoods = () => {
			array.forEach(item => {
				let position = arr_tmp.findIndex(elem => {
					if (item.data_goods.article == elem.data_goods.article) return true;
				});

				if (position != -1) {
					arr_tmp.splice(position, 1, item);
				} else {
					arr_tmp.push(item);
				}
			});
		}

		if ( !localStorage.getItem('chat') ) {
			addGoods();
			localStorage.setItem( 'chat', JSON.stringify(arr_tmp) );
		} else {
			arr_tmp = JSON.parse( localStorage.getItem('chat') );
			addGoods();
			localStorage.removeItem('chat');
			localStorage.setItem( 'chat', JSON.stringify(arr_tmp) );
		}

		createCardGhat.call(this, this.listGoods);
	},

	insertСorrespondence(answerServer) {
		let correspondence = answerServer.correspondence;

		// if ('is_read' in this.data_for_server) delete this.data_for_server.is_read;

		if (this.lengthCorrespondence == correspondence.length) {
			// delete this.data_for_server.is_read;
			return;
		}
		
		this.lengthCorrespondence = correspondence.length;
		deleteChildNodes(elemUL_message);

		correspondence.forEach(item => {

			if (this.data_for_server.id_partner != item.from_whom) {//отправитель == от кого
				elemUL_message.insertAdjacentHTML('beforeend', `
					<li class="messages-box outgoing">
						<p>${item.word}</p>
					</li>
				`)
			} else {
				elemUL_message.insertAdjacentHTML('beforeend', `
					<li class="messages-box incoming">
						<img src='${this.src_avatar}' alt="avatar" width="25" height="25">
						<p>${item.word}</p>
					</li>
				`)
			}
		})

		if (elemDiv_messagesScreen.clientHeight > elemUL_message.scrollHeight) {
			let top_indent = elemDiv_messagesScreen.clientHeight - elemUL_message.scrollHeight;
			elemUL_message.style.position = 'relative';
			elemUL_message.style.top = top_indent + "px";
		} else {
			elemUL_message.style.position = '';
			elemUL_message.style.top = '';
			elemDiv_messagesScreen.scrollTop = elemUL_message.scrollHeight;
		}

		let {num_message} = this.visitors.find(item => item.id_user == this.data_for_server.id_partner);
		
		if (num_message) this.data_for_server.is_read = true;
	},

	showActiveInterlocutors(arr) {
		let allLi = Array.from( elemUL_listPartners_chat.querySelectorAll('li') );

		arr.forEach(item => {
			let elem = allLi.find(point => point.dataset.id == item.id_user);
			let elem_iconActive = elem.querySelector('.icon-active');

			if (item.active != 0) {	
				elem_iconActive.classList.remove('hide');
			} else {
				elem_iconActive.classList.add('hide');
			}
		})
	},

	showNumberNewMessage(arr) {
		let allLi = Array.from( elemUL_listPartners_chat.querySelectorAll('li') );

		arr.forEach(item => {
			let elem = allLi.find(point => point.dataset.id == item.id_user);
			let elem_numberNewMessage = elem.querySelector('.number-new-message');

			if (item.num_message && item.id_user != this.data_for_server.id_partner) {
				elem_numberNewMessage.textContent = item.num_message;
				elem_numberNewMessage.classList.remove('hide');
			} else {
				elem_numberNewMessage.textContent = '';
				elem_numberNewMessage.classList.add('hide');
			}
		})
	},

	clearChatWindow() {

		if (elemUL_listPartners_chat.firstElementChild) deleteChildNodes(elemUL_listPartners_chat);

		if (elemDiv_headingInfoGoods_chat.firstElementChild) deleteChildNodes(elemDiv_headingInfoGoods_chat);

		if (elemDiv_headingInfoUser_chat.firstElementChild) deleteChildNodes(elemDiv_headingInfoUser_chat);

		if (elemUL_message.firstElementChild) {
			deleteChildNodes(elemUL_message);
			this.lengthCorrespondence = 0;
		}

		delete this.data_for_server.article;
		delete this.data_for_server.id_partner;
		delete this.src_avatar;
		delete this.visitors;
		elemTextarea_chat.disabled = true;
	}
};

function prepareDataChatDelete(obj) {
	let {article} = obj;
	collectDataForServer({action: 'delete chat', article});
}

function insertInfoHeadingUser (obj, num_partner) {

	if (elemDiv_headingInfoUser_chat.firstElementChild) deleteChildNodes(elemDiv_headingInfoUser_chat);

	let {user, src_avatar, id} = obj;
	elemDiv_headingInfoUser_chat.insertAdjacentHTML('beforeend', `
		<img class="box-img" src="${src_avatar}" alt="avatar" width="45" height="45">
		<div class="box-info"
	   	<span data-id="${id}">${user}</span>
		</div>`	 
	);

	if (num_partner) {
		let button = document.createElement('button');
		button.className = 'but-block-user';
		button.setAttribute('data-action', Number(obj.seller_ratio) || Number(obj.buyer_ratio)? 'unblock user': 'block user');
		button.title = Number(obj.seller_ratio) || Number(obj.buyer_ratio)? 'Розблокувати': 'Заблокувати';
		button.insertAdjacentHTML('beforeend', Number(obj.seller_ratio) || Number(obj.buyer_ratio)?
			'<img src="pictures/unblock user.png" alt="but unblock user" width="25" height="25">':
			'<img src="pictures/block user.png" alt="but block user" width="25" height="25">'
		);
		elemDiv_headingInfoUser_chat.append(button);
		button.onclick = function() {
			collectDataForServer( {action: this.dataset.action,
										  article: obj_window_chat.data_for_server.article,
										  id_partner: obj_window_chat.data_for_server.id_partner
										 } );
		};
	}
}

function getDataUserForServer(obj, num_partner) {
	obj_window_chat.data_for_server.id_partner = obj.id;
	obj_window_chat.src_avatar = obj.src_avatar;
	insertInfoHeadingUser(obj, num_partner);
	obj_window_chat.lengthCorrespondence = 0;
	deleteChildNodes(elemUL_message);
	elemTextarea_chat.disabled = false;
}

function insertInfoHeadingGoods(obj) {
	let href = document.location.href;
	let {article, title, price, src} = obj;
	elemDiv_headingInfoGoods_chat.insertAdjacentHTML('afterbegin', `
		<img class="box-img" src="${src}" alt="avatar goods" width="45" height="45">
      <div class="box-info info">
         <p class="info-title">${title}</p>
         <div class="info-brief">
            <div class="info-price">Цена: ${price} грн</div>
            <div class="info-article">Арт: ${article}</div>
         </div>
      </div>`
	);

	let button = document.createElement('button');
	button.classList.add('but-delete-chat');
	button.setAttribute('data-action', 'delete_chat');
	button.setAttribute('title', 'Видалити');
	button.insertAdjacentHTML('beforeend', `<img src=${href.includes('pages')? "../pictures/bin.png":"pictures/bin.png"} alt="photo" width="25" height="25">`);
	elemDiv_headingInfoGoods_chat.append(button);
	button.onclick = () => prepareDataChatDelete(obj);//нажатие на кнопку but-delete-chat
};

function assignClickLi() {

	if (elemUL_listPartners_chat.children.length > 1) {
		let allLi = elemUL_listPartners_chat.children;

		Array.from(allLi).forEach( (item, index) => {
			item.onclick = () => {
				getDataUserForServer(obj_window_chat.listPartners[index], true);
			};
		})

	} else {
		getDataUserForServer(obj_window_chat.listPartners[0]);
	}
}

function createCardUsers(arr) {

	arr.forEach(item => {
		let {id, user, src_avatar} = item;
		let li = document.createElement('li');
		li.className = 'partner';
		li.setAttribute('data-id', id);
		li.insertAdjacentHTML('beforeend', `
			<div class="number-new-message hide">5</div>
			<div class="wrapper-icons">
				<img src="${src_avatar}" alt="avatar" width="45" height="45">
				<div class="icon-active hide">
					<div class="indicator-active"></div>
				</div>
			</div>
		   <span>${user}</span>`
		);
		elemUL_listPartners_chat.append(li);
	})
	assignClickLi();
}

function getListPartners(obj) {
	let list = null;
		
	if ( obj.data_partner instanceof Array ) {
		list = obj.data_partner;
	} else {
		list = [];
		list[0] = obj.data_partner;
	}

	return list;
}

function changeAppearanceWindow(goods) {
	//проверяем событие клик
	let previous_article = obj_window_chat.data_for_server.article;
	let current_article = goods.data_goods.article;
	//если клик произошёл повторно на уже активном товаре завершаем выполнение функции
	if (current_article == previous_article) return;
	//иначе очищаю окно чата и объект чата от старых данных
	obj_window_chat.clearChatWindow();
	//выбираем партнеров по переписке
	obj_window_chat.listPartners = getListPartners(goods);
	obj_window_chat.data_for_server.article = goods.data_goods.article;

	createCardUsers(obj_window_chat.listPartners);
	insertInfoHeadingGoods(goods.data_goods);
}

function getGoodsForNewMessages(goods) {
	let listPartners = getListPartners(goods);

	if (!listPartners.length) {
		return true;
	} else {
		let arr = [goods.data_goods.article, listPartners.map(item => {return item.id})];
		obj_window_chat.data_for_server.product.push(arr);
	}
}

export function createCardGhat() {

	if (elemUl_listGoods_chat.firstElementChild) deleteChildNodes(elemUl_listGoods_chat);

	if ( !localStorage.getItem('chat') ) return;
	
	let listGoods = JSON.parse( localStorage.getItem('chat') );

	for (let i = 0; i < listGoods.length; i++) {

		if (getGoodsForNewMessages(listGoods[i])) continue;

		let {src, title, article, price, new_messages} = listGoods[i].data_goods;
		let li = document.createElement('li');
		li.classList.add('item-list-goods');
		li.setAttribute('data-article', article);
		li.insertAdjacentHTML('beforeend', `
			<div class="indicator-messages hide"></div>
			<img class="box-img" src="${src}" alt="avatar goods" width="45" height="45">
		   <div class="box-info info">
		      <div class="info-title">${title}</div>
		      <div class="info-brief">
		         <div class="info-brief__price">Цена: ${price} грн</div>
		         <div class="info-brief__article">Арт: ${article}</div>
		      </div>
		   </div>`);
		li.onclick = () => {changeAppearanceWindow(listGoods[i])};
		elemUl_listGoods_chat.append(li);
	}
	
	if (!interval) startSetInterval(obj_window_chat.data_for_server);
}

if (but_crossChat) {
	// Работаем с элементами только если они существуют
	but_crossChat.addEventListener('click', () => {
		closeWindow(window_chat);//The function is in the file authorization.js
		openWindow(window_mainContent);//The function is in the file authorization.js
		obj_window_chat.clearChatWindow();
	});
}

function defaultValue() {
	elemTextarea_chat.value = '';
	elemTextarea_chat.style.height = '';
	elemTextarea_chat.placeholder = 'Напишіть повідомлення';
	elemTextarea_chat.style.textAlign = 'center';
}

if (elemTextarea_chat) {
    // Работаем с элементами только если они существуют
    elemTextarea_chat.addEventListener('focus', (e) => {
		elemTextarea_chat.placeholder = '';
		elemTextarea_chat.style.textAlign = 'left';
	});

	elemTextarea_chat.addEventListener('blur', defaultValue);

	elemTextarea_chat.addEventListener('keyup', e => { //второй вариант
		const elem = e.target;
	   elem.style.height = ``;
	   elem.style.height = `${e.target.scrollHeight + 2}px`;
	});
}

if (elemBut_sendMessage_chat) {
	// Работаем с элементами только если они существуют
	elemBut_sendMessage_chat.addEventListener('mouseover', () => elemTextarea_chat.removeEventListener('blur', defaultValue));

	elemBut_sendMessage_chat.addEventListener('mouseout', () => elemTextarea_chat.addEventListener('blur', defaultValue));

	elemBut_sendMessage_chat.addEventListener('click', (e) => {
		e.preventDefault();

		if (elemTextarea_chat.value == 'Напишіть повідомлення') {
			return;
		} else if (elemTextarea_chat.value == '') {
			defaultValue();
			return;
		} else {
			collectDataForServer(form_sendMessage);
			clearFieldsForm(form_sendMessage);
			defaultValue();
		}
	});
}

