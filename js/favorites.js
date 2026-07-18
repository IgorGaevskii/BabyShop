import {window_mainContent} from "./module/variables.js";
import {panelControl} from "./module/panel control.js";
import manageCheckboxes from "./module/manage checkboxes.js";
import {openWindow, modalWindow, closeWindow} from "./module/open&closeWindow.js";

let window_favorites = document.querySelector('.favorites'),
	input_favoritePanelControl = window_favorites.querySelector(".control-panel input[type='checkbox']"),
	listFavorites = window_favorites.querySelector('.list-favorites'),
	but_crossFavorites = window_favorites.querySelector('.content-cross'),
	but_deleteFavorite = window_favorites.querySelector('.but_delete');

export let obj_window_favorites = {
	checkArticle(array) {

		if (window.location.pathname != '/pages/card%20goods.php') return;

		const urlParams = new URLSearchParams(window.location.search);
		const urlArticle = urlParams.get('codeNumber');

		if ( array.includes(urlArticle) ) {
			const btn_favorite = window_mainContent.querySelector('.btn-favorite');
			btn_favorite.classList.add('active');
			btn_favorite.title = 'Видалити з обраного';
		}
	},

	// создаем карточки товаров при авторизации
	createCardFavorite(array) {
		let arr_tmp = [];
		array.forEach(item => {
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
		const btn_favorite = document.querySelector('.btn-favorite');

		const url = new URL(window.location.href),
				urlArticle = url.searchParams.get('codeNumber');

		panelControl.data.articles.forEach(article => {
			let item = window_favorites.querySelector(`.item-favorites[data-article="${article}"]`);

			if (item) item.remove();

			if ( article == urlArticle && btn_favorite.classList.contains('active') ) {
				btn_favorite.classList.remove('active');
			}
		})
	}
};

but_crossFavorites.onclick = function() {
	closeWindow(window_favorites);
	openWindow(window_mainContent);
	//убираем галочки с input
	let listProdact = window_favorites.querySelectorAll('.box');

	listProdact.forEach(item => {
		panelControl.markedImputs = panelControl.getMarkedImputs(item);

		if (panelControl.markedImputs.length > 0) panelControl.deselectImputs(item);
	});
};

input_favoritePanelControl.onclick = manageCheckboxes;

but_deleteFavorite.onclick = function() {
	panelControl.pressedButton = this;
	panelControl.checkExistenceMarkedInputs();
}