"use strict"
import sendQuery from './module/sendQuery.js';
import showModalWindow from "./module/showModalWindow.js";
import {createCardGoods} from "./user advert.js";
import {createCardTradingUser} from "./user trading.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {obj_window_ask} from "./ask.js";
import {obj_window_chat, createCardGhat} from "./user chat.js";
import {changeAdvert} from "./new advert.js";

const ratingActive = document.querySelector('.rating_active'),
	ratingValue = document.querySelector('.rating_value'),
	btn_buy = document.querySelector('.card-goods-data-btn'),
	btn_writeMessage = document.querySelector('.write-message'),
	btn_swipeLeft = document.querySelector('.swipe-left'),
	btn_swipeRight = document.querySelector('.swipe-right'),
	modalWindow = document.querySelector('.modal'),
	elem_codeGoods = document.querySelector('.code_goods'),
	elem_price = document.querySelector('.price-goods strong'),
	elem_mainPhoto = document.querySelector('.main-photo'),
	elem_title = document.querySelector('.titel-goods'),
	elem_img = document.querySelector('.detailed_information img'),
	allElem_photoAlbum = document.querySelectorAll('.photo-album img');

let indexPhoto = 0;

function changeFeaturedPhoto() {
	let arr = Array.from(allElem_photoAlbum);
	let old_elem = arr.find(item => {if (item.className == 'highlighted') return item});

	if (old_elem) old_elem.classList.remove('highlighted');

	allElem_photoAlbum[indexPhoto].classList.add('highlighted');
}

function changeSrcPhoto() {
	let new_src = allElem_photoAlbum[indexPhoto].src;
	elem_mainPhoto.src = new_src;
	changeFeaturedPhoto();
}

let obj = {
	data_goods,
	data_partner
};

document.addEventListener('DOMContentLoaded', () => {
	createCardGoods();
	createCardTradingUser();
	createCardGhat();
	changeAdvert.insertListCategories();
	changeFeaturedPhoto();
});

btn_swipeLeft.addEventListener('click', () => {
	
	if (indexPhoto == 0) {
		return;
	} else {
		indexPhoto--;
		changeSrcPhoto();
	}
});

btn_swipeRight.addEventListener('click', () => {
	
	if (indexPhoto == allElem_photoAlbum.length - 1) {
		return;
	} else {
		indexPhoto++;
		changeSrcPhoto();
	}
});

btn_writeMessage.onclick = function() {
	let user = JSON.parse(sessionStorage.getItem('user'));

	if (user == null) {
		showModalWindow('Необхідно авторизуватись');
		return;
	}

	if (user.id == this.dataset.idSeller) {
		showModalWindow(`Вибачте<br>Ви не можете написати собі`);
		return;
	}

	obj_window_ask.checkWindowHidden(obj);
}

btn_buy.onclick = function() {
	let user = JSON.parse(sessionStorage.getItem('user'));
	
	if (user == null) {
		showModalWindow('Необхідно авторизуватись');
		return;
	}

	if (user.id == this.dataset.idSeller) {
		showModalWindow(`Вибачте.<br>Ви не можете придбати свій товар`);
		return;
	}

	let obj = {};
	let text = elem_codeGoods.textContent;
	obj.article = text.slice(-4);
	obj.action = 'purchase';
	collectDataForServer(obj);
}

// function setRating() {
// 	let ratingWidth = ratingValue.textContent / 0.05;
// 	ratingActive.style.width = `${ratingWidth}%`;
// }

// setRating();