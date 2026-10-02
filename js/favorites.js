import {window_mainContent, btn_favorite, window_favorites, listFavorites} from "./module/variables.js";
import {panelControl} from "./module/panel control.js";
import manageCheckboxes from "./module/manage checkboxes.js";
import {openWindow, modalWindow, closeWindow} from "./module/open&closeWindow.js";

let input_favoritePanelControl = window_favorites ? window_favorites.querySelector(".control-panel input[type='checkbox']") : null,
	 but_crossFavorites = window_favorites ? window_favorites.querySelector('.content-cross') : null,
	 but_deleteFavorite = window_favorites ? window_favorites.querySelector('.but_delete') : null;

export let obj_window_favorites = {
	checkArticle(array) {

		if (window.location.pathname != '/pages/card%20goods.php') return;

		const urlParams = new URLSearchParams(window.location.search);
		const urlArticle = urlParams.get('article');

		if ( array.includes(urlArticle) ) {
			// меняем стили у кнопки "Обране" на странице купить
			btn_favorite, window_favorites.classList.add('active');
			btn_favorite, window_favorites.title = 'Видалити з обраного';
		}
	},

	// создаем карточки товаров при авторизации
	createCardFavorite(array) {
		let arr_tmp = [];
		array.forEach(item => {
			console.log(item);
			let {article, title, price, src} = item;

			let li = document.createElement('li');
			li.classList.add('item-favorites');
			li.classList.add('card_ad');
			li.dataset.article = article;
			// класс card_ad вспомогательный используется в panel control in function getArticlesGoods()
			li.insertAdjacentHTML('beforeend', 
			  `<input type="checkbox">
				<div class="card-favorite">
					<img src="${src}" alt="фото" width="90" height="90">
					<ul class="card-data">
						<li><b>${title}</b></li>
						<li class='article'>Арт: ${article}</li>
						<li>Цена: ${price} гр</li>
					</ul>
				</div>
			`);
			listFavorites.append(li);
			arr_tmp.push(article);
		})
		/*	
			проверяем артикль
			эта проверка необходима для добавления кнопке btn-favorite класса active 
			если пользователь входит на сайт со страницы card goods 
			и товар открытый на этой страние уже существует в избранном
		*/
		this.checkArticle(arr_tmp);
	},

	removeCardFavorite() {
		const url = new URL(window.location.href),
				urlArticle = url.searchParams.get('article');

		panelControl.data.articles.forEach(article => {
			let item = window_favorites.querySelector(`.item-favorites[data-article="${article}"]`);

			if (item) item.remove();

			if ( article == urlArticle && btn_favorite.classList.contains('active') ) {
				btn_favorite.classList.remove('active');
			}
		})
	}
};

if (but_crossFavorites) {
	but_crossFavorites.onclick = function() {
		closeWindow(window_favorites);
		openWindow(window_mainContent);
		//убираем галочки с input
		panelControl.deselectImputs(window_favorites);
	}
}


if (input_favoritePanelControl) input_favoritePanelControl.onclick = manageCheckboxes;

if (but_deleteFavorite) {
		but_deleteFavorite.onclick = function() {
		panelControl.pressedButton = this;
		panelControl.checkExistenceMarkedInputs();
	}
}

if (listFavorites) {
	listFavorites.onclick = function(event) {
		// Если клик был по чекбоксу игнорируем переключение контента
		if (event.target.closest('input[type="checkbox"]')) {
	        return;
	    }

		if ( event.target.closest('.item-favorites') ) {
			let item_list = event.target.closest('.item-favorites');
			let article = item_list.dataset.article;
			document.location.href = `../pages/card goods.php?article=${article}`;
		}
	}
}