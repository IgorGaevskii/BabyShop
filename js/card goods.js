"use strict"
import sendQuery from './module/sendQuery.js';
import showModalWindow from "./module/showModalWindow.js";
import {createCardGoods} from "./user advert.js";
import {createCardTradingUser} from "./user trading.js";
import collectDataForServer from "./module/collectDataForServer.js";
import {obj_window_ask} from "./ask.js";
import {obj_window_chat, createCardGhat} from "./user chat.js";
import {changeAdvert} from "./new advert.js";
import {modalWindow, closeWindow, openWindow} from "./module/open&closeWindow.js";
import {managementWindows} from "./module/managementWindows.js";

const window_mainContent = document.querySelector('.main-content'),
	ratingActive = document.querySelector('.rating_active'),
	ratingValue = document.querySelector('.rating_value'),
	btn_buy = document.querySelector('.btn-buy'),
	btn_details = document.querySelector('.btn-details'),
	btn_ask = document.querySelector('.btn-ask'),
	btn_showGoodsSeller = window_mainContent.querySelector('.btn-goods-seller'),
	btn_swipeLeft = document.querySelector('.swipe-left'),
	btn_swipeRight = document.querySelector('.swipe-right'),
	btn_favorite = window_mainContent.querySelector('.btn-favorite'),
	allElem_photoAlbum = document.querySelectorAll('.photo-album img');

const section_fullInfoSeller = document.querySelector('.full-info-seller'),
	btn_closeModalWindow = section_fullInfoSeller.querySelector('.modal-window-cross');

const window_goodsSeller = document.querySelector('.goods-seller'),
	btn_crossGoodsSeller = window_goodsSeller.querySelector('.content-cross');

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

btn_ask.onclick = function() {
	// obj_data, id_currentUser создаётся на страницы card goods.php
	// в id_currentUser записуется id пользователя при авторизации
	// проверка авторизации клиент-сайд (для быстрой фидбэка)
	if (id_currentUser === null) {
		showModalWindow('Необхідно авторизуватись');
		return;
	}
	// проверка принадлежности товара (невозможно написать самому себя)
	if (id_currentUser == obj_data.id_user) {
		showModalWindow(`Неможливо написати собі`);
		return;
	}
	
	obj_window_ask.checkWindowHidden(obj_data);
}

btn_showGoodsSeller.addEventListener('click', function() {
	managementWindows(this);
})

btn_buy.onclick = function() {
	// obj_data, id_currentUser создаётся на страницы card goods.php
	// в id_currentUser записуется id пользователя при авторизации
	// проверка авторизации клиент-сайд (для быстрой фидбэка)
    if (id_currentUser === null) {
        showModalWindow('Необхідно авторизуватись');
        return;
    }

	// проверка принадлежности товара (невозможно купить у самого себя)
	if (id_currentUser == obj_data.id_user) {
		showModalWindow(`Неможливо купити свій товар`);
		return;
	}

	obj_data.action = 'purchase';
	sendQuery(JSON.stringify(obj_data), '../php/sold bought.php');
}

btn_details.addEventListener('click', () => {
	modalWindow.open = section_fullInfoSeller;
});

btn_closeModalWindow.onclick = () => {
	modalWindow.close();
}

btn_crossGoodsSeller.addEventListener('click', () => {
	closeWindow(window_goodsSeller);
	openWindow(window_mainContent)
})

// --- favorites handler ---
// Делегирование (подходит для динамически добавленных кнопок)
btn_favorite.addEventListener('click', async function() {
   // получаем article
   const article = obj_data.article;
   if (!article) return;

   // id_currentUser создаётся на страницы card goods.php
	// в id_currentUser записуется id пользователя при авторизации
   // проверка авторизации клиент-сайд (для быстрой фидбэка)
   if (id_currentUser === null) {
      showModalWindow('Необхідно авторизуватись');
      return;
   }

	// проверка принадлежности товара (невозможно добавить свой товар себе в избранное)
	if (id_currentUser == obj_data.id_user) {
		showModalWindow(`Неможливо додати свій товар в обране`);
		return;
	}

   // Делаем POST запрос на toggle_favorite.php
   try {
      const form = new FormData();
      form.append('articles', [article]);

      const resp = await fetch('/php/toggle_favorite.php', {
         method: 'POST',
         body: form,
         credentials: 'same-origin'
      });

        if (!resp.ok) {
            if (resp.status === 401) {
                alert('Пожалуйста, авторизуйтесь');
                return;
            } else {
                throw new Error('Network response not ok: ' + resp.status);
            }
        }

        const json = await resp.json();
        if (!json.success) {
            console.error('toggle_favorite error', json);
            alert('Ошибка сервера');
            return;
        }

        // Переключаем класс active
        if (json.action === 'added') {
            this.classList.add('active');
            this.title = 'Видалити з обраного';
            // если у вас в SVG заливка зависит от .active, CSS отработает
            // Дополнительно, если открыт модальный favorites — добавим элемент в список
            // const favModal = document.querySelector('.content.favorites');
            const window_favorites = document.querySelector('.favorites'),
            	  listFavorites = window_favorites.querySelector('.list-favorites');
                
            if (listFavorites) {
            	let {title, price, src} = json.product;
            	
               const li = document.createElement('li');
               li.classList.add('item-favorites');
               li.classList.add('card_ad');
               li.dataset.article = article;
               li.innerHTML = `
                	<input type="checkbox">
						<div class="card-favorite">
							<img src="${src}" alt="фото" width="90" height="90">
							<ul class="card-data">
								<li><b>${title}</b></li>
								<li class='article'>Арт: ${article}</li>
								<li>Цена: ${price} гр</li>
							</ul>
						</div>
					`;
                listFavorites.prepend(li);
            }
        } else if (json.action === 'removed') {
            this.classList.remove('active');
            // Если открыт модальный favorites — удалим элемент с таким article
            const window_favorites = document.querySelector('.favorites'),
            		item = window_favorites.querySelector('.item-favorites[data-article="'+article+'"]');

            if (item) item.remove();
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка при выполнении запроса');
    }
});