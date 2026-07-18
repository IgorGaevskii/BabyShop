import {window_ask, elem_askHeader, elem_messagesList, form_askQuestion, elem_typingArea, but_sendQuestion, but_crossAsk} from "./module/variables.js";
import {closeWindow} from "./module/open&closeWindow.js";
import collectDataForServer from "./module/collectDataForServer.js";
import deleteChildNodes from "./module/deleteChildNodes.js";
import clearFieldsForm from "./module/clearFieldsForm.js";
import {startSetInterval, stopSetInterval} from "./module/long query.js";

export let obj_window_ask = {
	data_for_server: {
		action: 'ask',
		//article,
		//id_partner,
		//is_read,
	},
	lengthCorrespondence: 0,

	checkWindowHidden(obj) {
		console.log(obj);
		if ( window_ask.classList.contains('show-ask') ) {
			return;
		} else {
			this.selectData(obj);
		}
	},
	
	selectData(obj) {
		this.data_for_server.article = obj.article;
		this.data_for_server.id_partner = obj.id_user;
		this.src_avatar = obj.src_seller;
		this.insertData(obj);
	},

	insertData(obj) {
		let {article, price, src_goods, title} = obj;
		elem_askHeader.insertAdjacentHTML('beforeend', `
			<div class="info-goods">
	         <img class="box-img" src="${src_goods}" alt="avatar goods" width="45" height="45">
	         <div class="box-info info">
	            <p class="info-title">${title}</p>
	            <div class="info-brief">
	               <div class="info-brief__price">Цена: ${price} грн</div>
	               <div class="info-brief__article">Арт: ${article}</div>
	            </div>
	         </div>
			</div>
		`);

		this.showWindowAsk();
	},

	showWindowAsk() {
		elem_typingArea.style.textAlign = 'center';
		window_ask.classList.add('show-ask');
		this.alwaysQuery();
	},

	alwaysQuery() {
		this.interval = setInterval( () => {
			collectDataForServer(this.data_for_server);
		}, 5000);
	},

	insertСorrespondence(correspondence) {
		delete this.data_for_server.is_read;

		if (this.lengthCorrespondence == correspondence.length) return;
		
		this.lengthCorrespondence = correspondence.length;
		deleteChildNodes(elem_messagesList);

		correspondence.forEach(item => {

			if (this.data_for_server.id_partner != item.from_whom) {//отправитель == от кого
				elem_messagesList.insertAdjacentHTML('beforeend', `
					<li class="messages-box outgoing">
						<p>${item.word}</p>
					</li>
				`)
			} else {
				console.log(item.is_read == 0)
				elem_messagesList.insertAdjacentHTML('beforeend', `
					<li class="messages-box incoming">
						<img src='${this.src_avatar}' alt="avatar" width="25" height="25">
						<p>${item.word}</p>
					</li>
				`)

				if (item.is_read == 0) {
					this.data_for_server.is_read = true;
				}
			}
			//опускаем блок вниз
			elem_messagesList.scrollTop = elem_messagesList.scrollHeight;
		})
	},

	hideWindowAsk() {
		window_ask.classList.remove('show-ask');
		console.log(this)
		delete this.data_for_server.article;
		delete this.data_for_server.id_partner;
		delete this.src_avatar;
		this.lengthCorrespondence = 0;
		setTimeout( () => {
			deleteChildNodes(elem_messagesList);
			elem_askHeader.children[1].remove();
			elem_typingArea.value = '';
		}, 900);
		clearInterval(this.interval);
	}
};

function defaultValue() {
	elem_typingArea.value = '';
	elem_typingArea.style.height = '';
	elem_typingArea.placeholder = 'Напишіть запитання';
	elem_typingArea.style.textAlign = 'center';
}

if (elem_typingArea) {
    // Работаем с элементами только если они существуют
	elem_typingArea.addEventListener('focus', () => {
		elem_typingArea.placeholder = '';
		elem_typingArea.style.textAlign = 'left';
	});

	elem_typingArea.addEventListener('blur', defaultValue);

	elem_typingArea.addEventListener('keyup', e => { //второй вариант
		const elem = e.target;
	   elem.style.height = ``;
	   elem.style.height = `${e.target.scrollHeight}px`;
	});
}

if (but_sendQuestion) {
    // Работаем с элементами только если они существуют
	but_sendQuestion.addEventListener('mouseover', () => elem_typingArea.removeEventListener('blur', defaultValue));

	but_sendQuestion.addEventListener('mouseout', () => elem_typingArea.addEventListener('blur', defaultValue));

	but_sendQuestion.addEventListener('click', (e) => {
		e.preventDefault();

		if (elem_typingArea.value == 'Напишіть запитання') {
			return;
		} else if (elem_typingArea.value == '') {
			defaultValue();
			return;
		} else {
			collectDataForServer(form_askQuestion);
			clearFieldsForm(form_askQuestion);
			defaultValue();
		}
	});
}

if (but_crossAsk) {
    // Работаем с элементами только если они существуют
    but_crossAsk.onclick = obj_window_ask.hideWindowAsk.bind(obj_window_ask);
}