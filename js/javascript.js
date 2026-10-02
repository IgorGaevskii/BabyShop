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

elem_topCard.onclick = (event) => {

	if ( event.target.closest('.card') ) {
		let card = event.target.closest('.card');
		let article = card.dataset.article;
		document.location.href = `../pages/card goods.php?article=${article}`;
	}
}