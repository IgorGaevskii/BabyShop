import {createCardGoods} from "./user advert.js";
import {createCardTradingUser} from "./user trading.js";
import {changeAdvert} from "./new advert.js";
import {obj_window_chat, createCardGhat} from "./user chat.js";
import {interval, startSetInterval, stopSetInterval} from "./module/long query.js";

const allWindow = document.querySelectorAll('.window'),
	elem_topCard = document.querySelector('.top-card');

const obj = {
	nameError: {
		one: 'Проверте правильность ввода E-mail и пароля',
		two: 'Введенный E-mail не валидный.<br>Пожалуйста! Введите другой E-mail.',
		three: 'Длина пароля должна быть от 8 до 24 символов',
		four: 'Пароль должен содержать не мение 2 числовых и 2 буквенных символов в верхнем регистре',
		five: 'Пароли не совпадают',
		six: 'Имя должно начинаться с большой буквы',
		seven: 'Фамилия должна начинаться с большой буквы',
		eight: 'Неверный формат ввода!'
	},
	checkError() {

		for (let key in this) {

			if (key == 'checkError' || key == 'nameError') {
				continue;
			} else if (this[key].empty || !this[key].valid) {
				return true;
			}
		}
		
		return false;
	}
};

//dynamically load html markup of registration forms
document.addEventListener('DOMContentLoaded', () => {
	createCardGoods();
	createCardTradingUser();
	createCardGhat()
	changeAdvert.insertListCategories();

	if ( (sessionStorage.getItem('advert') || sessionStorage.getItem('trading') || localStorage.getItem('chat') ) && !interval ) startSetInterval(obj_window_chat.data_for_server);
});

window.addEventListener("unload", () => {

	if ( !window_newAd.classList.contains('hide') ) {
		let formData = new FormData();
		formData.append('idUser', JSON.parse(sessionStorage.getItem('user')).id);
		formData.append('action', 'pageReload');
		navigator.sendBeacon('../php/appendGoods.php', formData);
	}
});

function showModalWindow(answer, elem) {
	let modalContent = modalWindow.querySelector('.modal-content');
	modalContent.innerHTML = `<p>${answer}</p>
							<button id='but-modal'>ok</button>`;
	modalWindow.style.display = 'flex';

	document.getElementById('but-modal').onclick = () => {
		deleteChildNodes(modalContent);
		modalWindow.style.display = 'none';
		// delete ticks with select impyts in window "user_advert"
		if (panelControlAd.markedImputs) {
			panelControlAd.deselectImputs();
		} else if ( elem.matches('input[name="email"]') || elem.matches('input[name="password"]') ) {
			elem.focus();
		}
	}
}

function closeModalWindow(modal_window, form, description) {
	modal_window.classList.add('hide');
	clearFieldsRegistration(form);
	removeElementsError();

	if (description) description.innerHTML = '';

	if ( form.matches('[name="forgotPassword"]') ) but_forgotPassword.disabled = false;
}

elem_topCard.onclick = (event) => {

	if ( event.target.closest('.card') ) {
		let card = event.target.closest('.card');
		let codeNumber = card.querySelector('.code-number').textContent;
		document.location.href = `../pages/card goods.php?codeNumber=${codeNumber}`;
	}
}