import sendQuery from "./sendQuery.js";
import {obj_window_ask} from "../ask.js";
import {obj_window_chat} from "../user chat.js";
import {obj_window_trading} from "../user trading.js";

export default function collectDataForServer(data) {
	console.log('inside function collectDataForServer');
	console.log(data);
	let url = '';
	let formData = '';

	if (data instanceof HTMLElement) {
		let form = data;
		formData = new FormData(form);

		if (form.name == 'registrationMoveOne' || form.name == 'forgotPassword') {
			url = '/php/registration user move one.php';
			form.name == 'registrationMoveOne'?
				formData.append('action', 'registrationMoveOne'):
				formData.append('action', 'forgotPassword');
		} else if (form.name == 'authorizationUser') {
			url = "../../php/authorization user.php";
			formData.append('action', 'authorization');
		} else if (form.name == 'registrationMoveTwo') {
			url = "../../php/registration user move two.php";
			formData.append('action', 'registrationMoveTwo');
		} else if (form.name == 'review user') {
			url = "../../php/review user.php";
			formData.append('action', 'review user');
			formData.append('id_review', obj_window_trading.id_review);
		} else if (form.name == 'ask_question') {
			url = "../../php/askQuestion.php";
			formData.append('action', 'ask question');
			formData.append('article', obj_window_ask.data_for_server.article);
			formData.append('id_partner', obj_window_ask.data_for_server.id_partner); //получатель
		} else {
			url = "../../php/askQuestion.php";
			console.log(obj_window_chat.data_for_server);
			formData.append('action', 'send message');
			formData.append('article', obj_window_chat.data_for_server.article);
			formData.append('id_partner', obj_window_chat.data_for_server.id_partner); //получатель
		}
	} else if (typeof data === 'object') {
		formData = new FormData();

		switch (data.action) {
			case 'purchase':
				formData.append('article', data.article);
				formData.append('id_buyer', JSON.parse(sessionStorage.getItem('user')).id);
				url = '../../php/sold bought.php';
				break;
			case 'deactivate':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				url = '../php/appendGoods.php';
				break;
			case 'activate':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				url = '../php/appendGoods.php';
				break;
			case 'edit':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				url = '../php/loading data.php';
				break;
			case 'delete':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				formData.append('idUser', JSON.parse(sessionStorage.getItem('user')).id);
				url = '../php/appendGoods.php';	
				break;
			case 'removeSale':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				url = '../php/remove sale.php';
				break;
			case 'removePurchase':
				formData.append('action', data.action);
				formData.append('data', data.articles);
				url = '../php/remove sale.php';
				break;
			case 'ask':
				formData.append('action', data.action);
				formData.append('article', data.article);
				formData.append('id_partner', data.id_partner); //получатель
				if (data.is_read) formData.append('is_read', data.is_read);
				url = '../php/ask.php';
				break;
			case 'sales':
				formData.append('action', data.action);
				formData.append('articles', data.articles);
				url = '../../php/monitor sale.php';
				break;
			case 'delete chat':
				formData.append('action', data.action);
				formData.append('article', data.article);
				formData.append('id_partner', data.id_partner);
				url = '../../php/delete chat.php';
				break;
			case 'block user':
				formData.append('action', data.action);
				formData.append('article', data.article);
				formData.append('id_partner', data.id_partner);
				url = '../../php/block user.php';
				break;
			case 'unblock user':
				formData.append('action', data.action);
				formData.append('article', data.article);
				formData.append('id_partner', data.id_partner);
				url = '../../php/block user.php';
				break;
			default:
				formData.append('action', data.action);
				formData.append('product', JSON.stringify(data.product));
				if (data.article) formData.append('article', data.article);
				if (data.id_partner) formData.append('id_interlocutor', data.id_partner);
				if ( data.hasOwnProperty('is_read') ) {
					formData.append('is_read', data.is_read);
					delete obj_window_chat.data_for_server.is_read;
				}
				url = '../php/chat.php';
		}
	} else if (typeof data === 'string') {
		formData = data;
		url = "../../php/log out.php";
	}

	// console.log('Data for server');
	// for (let [key, value] of formData) {
	// 	console.log(`${key}: ${value}`)
	// }

	// console.log(url);

	sendQuery(formData, url);
}