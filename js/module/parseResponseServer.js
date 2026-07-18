import clearFieldsForm from "./clearFieldsForm.js";
import showModalWindow from "./showModalWindow.js";
import {createCardGoods, changeDisplayAdverts, deleteCardGoods} from "../user advert.js";
import {createCardTradingUser, removeCardTradingUser, obj_window_trading} from "../user trading.js";
import {changeAdvert} from "../new advert.js";
import {input_emailAuthorization, input_passwordAuthorization, elem_numberNewMessages} from "./variables.js";
import {modalWindow} from "./open&closeWindow.js";
import {reviewSeller, reviewBuyer} from "../review user.js";
import createElemError from "./createElemError.js";
import {obj_window_ask} from "../ask.js";
import {obj_window_chat} from "../user chat.js";
import {interval, startSetInterval} from "./long query.js";
import {obj_window_favorites} from "/js/favorites.js";

export default function parseResponseServer(answerServer) {
	const userName = document.getElementById('user-name'),
		window_authorization = document.getElementById('authorization'),
		window_cabinet = document.getElementById('cabinet'),
		formAuthorization = document.forms.authorizationUser;
	
	switch (answerServer.action) {
		case 'forgotPassword':
			const window_forgotPassword = document.querySelector('.content'),
					form_forgotPassword = window_forgotPassword.querySelector('form'),
					elem_descriptionForgotPassword = window_forgotPassword.querySelector('.description'),
					but_forgotPassword = window_forgotPassword.querySelector('#but-forgot_password');

			if (answerServer.status == 'not found') {
				elem_descriptionForgotPassword.innerHTML = answerServer.bodyAnswer;
				field_emailUser_FP.value = '';
			} else if (answerServer.status == 'error') {
				elem_descriptionForgotPassword.textContent = answerServer.bodyAnswer;
				but_forgotPassword.disabled = true;
				clearFieldsForm(form_forgotPassword); //очищаю поля формы
			} else {
				elem_descriptionForgotPassword.textContent = answerServer.bodyAnswer;
				but_forgotPassword.disabled = true;
				clearFieldsForm(form_forgotPassword); //очищаю поля формы
			}
			break;

		case 'getTopGoods':
			let topGoods = answerServer.topGoods;
			createCardTopGoods(topGoods);
			break;

		case 'registrationMoveOne':
			const window_registrationMoveOne = document.querySelector('.content'),
					elem_descriptionMoveOne = window_registrationMoveOne.querySelector('.description'),
					but_registrationMoveOne = window_registrationMoveOne.querySelector('#but-registration-move-one'),
					form_registrationMoveOne = document.forms.registrationMoveOne;

			if (answerServer.status == 'match') {
				elem_descriptionMoveOne.innerHTML = answerServer.bodyAnswer;
				field_emailUser.value = '';
			} else if (answerServer.status == 'error') {
				elem_descriptionMoveOne.innerHTML = answerServer.bodyAnswer;
				but_registrationMoveOne.disabled = true; //отключаю кнопку отправить
				clearFieldsForm(form_registrationMoveOne); //очищаю поля формы
			} else {
				elem_descriptionMoveOne.innerHTML = answerServer.bodyAnswer;
				but_registrationMoveOne.disabled = true; //отключаю кнопку отправить
				clearFieldsForm(form_registrationMoveOne); //очищаю поля формы
			}
			break;
			
		case 'registrationMoveTwo':
			const window_registrationMoveTwo = document.querySelector('.content'),
					elem_descriptionMoveTwo = window_registrationMoveTwo.querySelector('.description'),
					elem_сhooseAvatar = window_registrationMoveTwo.querySelector('.сhoose-avatar'),
					but_registrationMoveTwo = window_registrationMoveTwo.querySelector('#but-registration-move-two'),
					form_registrationMoveTwo = document.forms.registrationMoveTwo;

					if ( answerServer.hasOwnProperty('problem') ) {
						elem_descriptionMoveTwo.innerHTML = "<p>Дані успішно додані. Але під час завантаження зображення для профілю виникла помилка. <br>1. Ви можете вибрати інше зображення та повторно натиснути 'Надіслати',<br>2. Ви можете проігнорувати помилку і для подальшої роботи на сайті пройдіть авторизацію. Зображення профілю можна буде додати через особистий кабінет.</p>";
						createElemError(elem_сhooseAvatar, answerServer.problem);
					}

					if (answerServer.status == 'success') {
						elem_descriptionMoveTwo.innerHTML = "<p>Дані успішно додані.<br><br>Для подальшої роботи на сайті пройдіть авторизацію.</p>";
						clearFieldsForm(form_registrationMoveTwo); //очищаю поля формы
						but_registrationMoveTwo.disabled = true;
					}
			break;

		case 'authorization':

			if (answerServer.status == 'success') { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
				let infoUser = JSON.stringify(answerServer.dataUser);
				sessionStorage.setItem('user', infoUser);
				userName.textContent = `${answerServer.dataUser.user}`;
				window_authorization.style.transform = "rotateY(180deg)";
				window_cabinet.style.transform = "rotateY(360deg)";
				clearFieldsForm(formAuthorization);

				let temp_array = [];
			
				if ('advertsUser' in answerServer) {
					let adsUser = JSON.stringify(answerServer.advertsUser);
					sessionStorage.setItem('advert', adsUser);
					temp_array = temp_array.concat(answerServer.advertsUser);
					createCardGoods();
				}

				if ('tradingUser' in answerServer) {
					let tradingUser = JSON.stringify(answerServer.tradingUser);
					sessionStorage.setItem('trading', tradingUser);
					temp_array = temp_array.concat(answerServer.tradingUser);
					createCardTradingUser();
				}

				if ('chatUser' in answerServer) {
					localStorage.setItem( 'chat', JSON.stringify(answerServer.chatUser) );
					temp_array = temp_array.concat(answerServer.chatUser);
				}

				if (temp_array.length) obj_window_chat.getListGoods(temp_array);

				//передаем в объект obj_window_favorites данные для создания карточек избранных товаров и их отображения
				if ('favorites' in answerServer) obj_window_favorites.createCardFavorite(answerServer.favorites)
				// currentUserId создаётся на страницы card goods.php
				// в currentUserId записуется id пользователя при авторизации
				if (window.location.pathname == '/pages/card%20goods.php') currentUserId = answerServer.dataUser.id;
			}

			if (answerServer.status == 'not match') showModalWindow('Перевірте правильність введення пароля.', input_passwordAuthorization);
			
			if (answerServer.status == 'not found') showModalWindow('Перевірте правильність введення електронної пошти', input_emailAuthorization);

			if (answerServer.status == 'not confirmed') {
				showModalWindow('Підтвердьте будь ласка адресу електронної пошти');
				clearFieldsForm(formAuthorization);
			}

			if (answerServer.status == 'error') {
				showModalWindow('Вибачте виникла помилка спробуйте пізніше');
				clearFieldsForm(formAuthorization);
			}
			break;

		case 'purchase':

			if ('dataPurchaseGoods' in answerServer) {
				let arr_purchasedGoods = [];

				if ( sessionStorage.getItem('trading') ) {
					arr_purchasedGoods = JSON.parse( sessionStorage.getItem('trading'));
					arr_purchasedGoods.push(answerServer.dataPurchaseGoods);
				} else {
					arr_purchasedGoods = [answerServer.dataPurchaseGoods]
				}
				
				sessionStorage.setItem('trading', JSON.stringify(arr_purchasedGoods));
				createCardTradingUser();
				showModalWindow('Вітаємо з покупкою товару.');
			} else {
				showModalWindow('Вибачте товар вже куплений іншим покупцем.');
			}

			document.querySelector('.btn-buy').disabled = true;
			break;
		case 'deactivate':
			/*функция изменяющая значение свойства display с show на hide в массиве 
			объявлений пользователя для скрытия или показа объявлений*/
			changeDisplayAdverts();
			if ('sing' in answerServer) obj_window_chat.removeChat();
			break;
		case 'activate':
			changeDisplayAdverts();
			break;
			
		case 'edit':
			changeAdvert.data = answerServer.dataGoods; //new advert.js
			changeAdvert.changeViewWindow('updateAdvert'); //new advert.js
			break;
		case 'delete':
			deleteCardGoods();
			break;
		case 'removeSale':
			removeCardTradingUser();//user trading.js
			obj_window_chat.removeChat();
			break;
		case 'removePurchase':
			removeCardTradingUser();
			obj_window_chat.removeChat();
			break;
		case 'review user':
			modalWindow.close; 
			modalWindow.elem.classList.contains('review-about-seller')?
			reviewBuyer.clearForm():
			reviewSeller.clearForm();
			showModalWindow('Ваш відгук успішно доданий', modalWindow.elem);
			break;
		case 'ask':
			obj_window_ask.insertСorrespondence(answerServer.correspondence);
			break;
		case 'chat':
			if ('new_chat' in answerServer) obj_window_chat.getListGoods(answerServer.new_chat);
			if ('new_partner' in answerServer) obj_window_chat.addNewPartner(answerServer.new_partner);
			if ('number_new_message' in answerServer) obj_window_chat.showNewMessageGoods(answerServer.number_new_message);
			if ('correspondence' in answerServer) obj_window_chat.insertСorrespondence(answerServer);
			break;
		case 'ask question':

			if (!interval) startSetInterval(obj_window_chat.data_for_server);
			if ('status goods' in answerServer) showModalWindow(`Вибачте.<br>${answerServer['status goods']} неможливо написати повідомлення`);
			break;
		case 'send message':

			if ('status goods' in answerServer) {
				showModalWindow(`Вибачте.<br>${answerServer['status goods']} неможливо написати повідомлення`);
				// delete obj_window_chat.data_for_server.id_partner;
			}
		case 'sales':

			if ('new_sales' in answerServer) obj_window_trading.insertDataSessionStorage(answerServer.new_sales);

			if ('new_remove' in answerServer) obj_window_trading.disableWriteMessageButton(answerServer.new_remove);
			break;
		case 'delete chat':
			obj_window_chat.removeChat(answerServer.article);
			showModalWindow(answerServer.message);
			break;
		case 'block user':
			delete answerServer.status;
			obj_window_chat.toggleLockIconInStorage(answerServer);
			break;
		case 'unblock user':
			delete answerServer.status;
			obj_window_chat.toggleLockIconInStorage(answerServer);
			break;
		case 'removed': // удаляем карточки из окна favorite
			obj_window_favorites.removeCardFavorite();
			break;
		default:
			// запускается при выходе пользователя из кабинета
			if (answerServer.success) currentUserId = null;
			break;
	}
}