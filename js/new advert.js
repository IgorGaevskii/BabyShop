import {window_mainContent, allItemsMenu, window_newAdvert, headingName, form_newAd, nameGoodsInput, priceGoodsInput, descriptionGoodsTextarea} from "./module/variables.js";
import {closeWindow, openWindow} from './module/open&closeWindow.js';
import deleteChildNodes from "./module/deleteChildNodes.js";
import clearFieldsForm from "./module/clearFieldsForm.js";
import {createCardGoods} from "./user advert.js";
import {panelControl} from "./module/panel control.js";
import showModalWindow from "./module/showModalWindow.js";
import {obj_window_trading} from "./user trading.js";
import {obj_window_chat} from "./user chat.js";
import {interval, startSetInterval} from "./module/long query.js";

const elem_addAdvertCategory = document.querySelector('.addAdvert_category'),
	allOption_addAdvertCategory = elem_addAdvertCategory ? elem_addAdvertCategory.getElementsByTagName('option') : [],
	elem_addAdvertSubcategory = document.querySelector('.addAdvert_subcategory'),
	allOption_addAdvertSubcategory = elem_addAdvertSubcategory ? elem_addAdvertSubcategory.getElementsByTagName('option') : [],
	inputHatActiveAds = document.querySelector('.active_ads input'),
	inputHatInactiveAds = document.querySelector('.inactive_ads input'),
	elem_description = document.querySelector('.new_advert_description p'),
	but_crossNewAd = document.querySelector('.new_advert .content-cross'),
	but_sendAd = document.getElementById('but_send_advert'),
	allBut_addPhoto = document.querySelectorAll('.but_add_photo'),
	appendPhoto = document.querySelector('[name="photo_goods"]'),
	
	window_userAds = document.querySelector('.user_advert'),
	header = document.querySelector('header'),
	containerActiveAds = document.querySelector('.container_active_ads'),
	containerInactiveAds = document.querySelector('.container_inactive_ads');

let sendAdvert = {
    validateUkrainian(value) {// Функция проверки на украинские буквы и знаки препинания
        // Украинские буквы, пробел, апостроф, дефис, кома, крапка, двокрапка, дужки, лапки, знак оклику, питання
        const regex = /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ'’"«»\-\s.,:()!?]+$/u;
        return regex.test(value.trim());
    },

	collectData(elem) {
		let formData = new FormData(form_newAd); // 2
		let dataUser = JSON.parse(sessionStorage.getItem('user'));// 1
		formData.append('idUser', dataUser.id); //Добавляю в объект FormData данные id

		if (elem.textContent == 'Відправити') { 
			formData.append('action', 'submitAdvert');
		} else {
			formData.append('action', 'updateAdvert');
			formData.append('article', panelControl.data.articles);
		}

		this.validation(formData);
	},

	validation(formData) {
		for (let [key, value] of formData) {

			if (key == 'id_category' && value == 'allCategory') {
				showModalWindow('Вкажіть категорію товару');
				return
			}

			if (key == 'id_subcategory' && value == 'allSubcategory') {
				showModalWindow('Вкажіть підкатегорію товару.');
				return;
			}

			// Проверка поля name_goods на украинские символы и знаки препинания
			if ( !this.validateUkrainian(nameGoodsInput.value) ) {
				showModalWindow('Назва товару повинна містити лише українські літери та знаки пунктуації.', nameGoodsInput);
				return;
			}

			// Проверка поля price_goods на положительно целое число, на дробное число с двумя знаками после запятой, не пустое, не 0
			if (key == 'price_goods') {
				const price = value.trim();

				if (!/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) {
					showModalWindow('Вкажіть коректну ціну.', priceGoodsInput);
					return;
				}
			}

			// Проверка поля name_goods на украинские символы и знаки препинания
			if ( !this.validateUkrainian(descriptionGoodsTextarea.value) ) {
				showModalWindow('Опис товару повинен містити лише українські літери та знаки пунктуації.', descriptionGoodsTextarea);
				return;
			}
		}

		let arr_valueDatasetBut = Array.from(allBut_addPhoto).map(item => item.dataset.action);

		if ( !arr_valueDatasetBut.includes('removePhoto') ) {
			showModalWindow(`Вставте пожалуйста изображение`);
			return;
		}

		// let indexEmtyButton = arr_valueDatasetBut.findIndex(item => item == 'appendPhoto');

		// if (indexEmtyButton != -1) {
		// 	let new_arr = arr_valueDatasetBut.slice(indexEmtyButton + 1);
		// 	console.log(new_arr);
		// 	debugger;
		// 	if ( new_arr.includes('removePhoto') ) {
		// 		showModalWindow(`Вставте пожалуйста изображение в ${indexEmtyButton + 1} поле.`);
		// 		return;
		// 	}
		// }

		sendAd(formData); 
	}
};

export let changeAdvert = {
	data: '',
	subcategories: {},

	changeViewWindow(viewWindow) {
		if (viewWindow) {
			headingName.textContent = 'Змінити оголошення';
			but_crossNewAd.dataset.statusWindow = 'updateAdvert';
			but_sendAd.textContent = 'Змінити';
			this.insertData();
		} else {
			headingName.textContent = 'Нове оголошення';
			but_crossNewAd.dataset.statusWindow = 'newAdvert';
			but_sendAd.textContent = 'Відправити';
			return;
		}
	},

	insertData() {
		//insert category
		let article = panelControl.data.articles[0];
		let code_category = article[0];
		let option_addAdvertCategory = Array.from(allOption_addAdvertCategory).find(option => option.value == code_category);
		option_addAdvertCategory.selected = true;
		//

		//insert subcategory
		this.insertListSubcategories(code_category);

		/*get subcategory goods*/
		let code_subcategory = null;
		let slice_article = article.slice(1, 3);

		if (slice_article[0] == 0) {
			code_subcategory = slice_article[1];
		} else {
			code_subcategory = slice_article;
		}

		let option_addAdvertSubcategory = Array.from(allOption_addAdvertSubcategory).find(option => option.value == code_subcategory);
		option_addAdvertSubcategory.selected = true;

		form_newAd.querySelector('input[name="name_goods"]').value = this.data.title;
		form_newAd.querySelector('input[name="price_goods"]').value = this.data.price;
		blockPhoto.insertPhoto(this.data.src);
		form_newAd.querySelector('textarea').value = this.data.description;
		form_newAd.querySelectorAll('input[name="state_goods"]').forEach(item => {
			item.value == this.data.state_goods? item.checked = true: item.checked = false;
		});
		form_newAd.querySelectorAll('input[name="stock_goods"]').forEach(item => {
			item.value == this.data.stock_goods? item.checked = true: item.checked = false;
		});
		form_newAd.querySelectorAll('input[name="time_display"]').forEach(item => {
			item.value == this.data.time_display? item.checked = true: item.checked = false;
		});
		form_newAd.querySelectorAll('input[name="radio_goods"]').forEach(item => {
			item.value == this.data.top? item.checked = true: item.checked = false;
		});

		closeWindow(window_userAds);
		openWindow(window_newAdvert);
		// panelControl.deselectImputs();
	},

	insertListCategories() {
		allItemsMenu.forEach(item => {
			let linkCategory = item.querySelector('.menu-item-category');
			let listNodesSubcategory = item.querySelectorAll('.subitem-link');

			elem_addAdvertCategory.insertAdjacentHTML('beforeend', `
				<option value="${linkCategory.dataset.idCategory}">${linkCategory.textContent}</option>
			`)

			this.subcategories[linkCategory.dataset.idCategory] = listNodesSubcategory;
		})
	},

	insertListSubcategories(token) {
		elem_addAdvertSubcategory.disabled = false;
		deleteChildNodes(elem_addAdvertSubcategory);
		elem_addAdvertSubcategory.innerHTML = '<option value="allSubcategory">Выберите подкатегорию</option>';

		let listSubcategories = this.subcategories[token];
		listSubcategories.forEach(node => {
			elem_addAdvertSubcategory.insertAdjacentHTML('beforeend', `
				<option value="${node.dataset.idSubcategory}">${node.textContent}</option>
			`)

		})
	}
};

let blockPhoto = {
	pressButton: '',
	indexButton: '',

	insertPhoto(arr) {
		allBut_addPhoto.forEach((item, index) => {

			if (!arr[index]) return;

			deleteChildNodes(item);
			item.innerHTML = `<img src="${arr[index]}" width="70" height="70">`;
			item.setAttribute('data-action', 'removePhoto');
		})
	},

	findEmptyButton() {
		this.indexButton = Array.from(allBut_addPhoto).findIndex(item => 
			(item.dataset.action == 'appendPhoto') ) + 1;
		this.checkPressButton();
	},

	checkPressButton() {

		if (Number(this.pressButton.dataset.numberbutton) != this.indexButton) {
			showModalWindow(`Будь ласка, <br>заповніть ${this.indexButton} поле.`);
		} else {
			appendPhoto.click();
		}
	},

	createFormData() {
		let formData = new FormData();

		if (this.pressButton.dataset.action == 'appendPhoto') {
			formData.append('action', this.pressButton.dataset.action);
			formData.append('numBut', this.pressButton.dataset.numberbutton);
			formData.append('photo', appendPhoto.files[0]);
		} else if (this.pressButton.dataset.action == 'removePhoto') {
			formData.append('action', this.pressButton.dataset.action);
			formData.append('numBut', this.pressButton.dataset.numberbutton);
		} else {
			formData.append('action', 'removeTempData');
			formData.append('status', this.pressButton.dataset.statusWindow);
			formData.append('article', changeAdvert.data.article);
		}

		console.log('Data for server:');
		for (let [nameProperty, valueProperty] of formData) {
			console.log(`${nameProperty}: ${valueProperty}`);
		}

		this.sendPhoto(formData);
		appendPhoto.value = '';
	},

	async sendPhoto(formData) {
		let response = await fetch('../php/appendGoods.php', {
			method: 'POST',
			body: formData
		});

		if (response.ok) { //проверяем статус ответа сервера
			let answerServer = await response.json(); //получаем тело ответа
			console.log(answerServer)
			answerServer.forEach((item, index) => {
				// deleteChildNodes(allBut_addPhoto[index]);//cleaning tag fieldset
				
				if (item) {
					allBut_addPhoto[index].innerHTML = `<img src="${item}" width="70" height="70">`;
					allBut_addPhoto[index].setAttribute('data-action', 'removePhoto');
				} else {
					allBut_addPhoto[index].textContent = index + 1;
					allBut_addPhoto[index].setAttribute('data-action', 'appendPhoto');
				}
			});
		}
	}
};

async function sendAd (formData) {
	for (let [key, value] of formData) {
		console.log(`${key} : ${value}`);
	}

	let request = await fetch('../php/appendGoods.php', {
		method: 'POST',
		body: formData
	});

	if (request.ok) { //проверяем статус ответа сервера
		let answerServer = await request.json(); //получаем тело ответа

		if (answerServer.status == 'success') {
			clearFieldsForm(form_newAd);

			for (let item of allBut_addPhoto) {

				if (item.firstElementChild) {
					deleteChildNodes(item);//cleaning tag fieldset
					item.textContent = item.dataset.numberbutton;
					item.dataset.action = 'appendPhoto';
				}
			}

			deleteChildNodes(containerActiveAds, containerInactiveAds);

			if ( sessionStorage.getItem('advert') ) {
				sessionStorage.removeItem('advert');
				sessionStorage.setItem( 'advert', JSON.stringify(answerServer.advertsUser) );
			} else {
				sessionStorage.setItem( 'advert', JSON.stringify(answerServer.advertsUser) );
			}

			createCardGoods();

			if (answerServer.action == 'submitAdvert') {

				if ( answerServer.hasOwnProperty("topGoods") ) {
					
					if ( window_mainContent.classList.contains('top-card') ) {
						deleteChildNodes(window_mainContent);
						answerServer.topGoods.forEach(item => {
							window_mainContent.insertAdjacentHTML('beforeend', 
								`<div class='card'>
									<img src='${item.src}' width='230' height='230'>
									<p class="card__name">${item.title}</p>
									<p class="card__code">Код товара: <span class="code-number">${item.article}</span></p>
									<p class="card__price">Цена: ${item.price} гр</p>
								</div>`);
						});
					}
				}
				showModalWindow('Оголошення успішно додано.');
				
			} else {
				closeWindow(window_newAdvert);
				openWindow(window_userAds);
				showModalWindow('Оголошення успішно змінено.');
				let parent = panelControl.pressedButton.closest('.hat_ads');
				parent.classList.contains('active_ads')?
				inputHatActiveAds.checked = false:
				inputHatInactiveAds.checked = false;
				changeAdvert.changeViewWindow();
				
				if ( window_mainContent.classList.contains('top-card') ) {
					deleteChildNodes(window_mainContent);
					answerServer.topGoods.forEach(item => {
						window_mainContent.insertAdjacentHTML('beforeend', 
							`<div class='card'>
								<img src='${item.src}' width='230' height='230'>
								<p class="card__name">${item.title}</p>
								<p class="card__code">Код товара: <span class="code-number">${item.article}</span></p>
								<p class="card__price">Цена: ${item.price} гр</p>
							</div>`);
					});
				}
			}

		} else {
			showModalWindow('Вибачте! Виникла помилка. Спробуйте пізніше.');
		}
	}
}

if (elem_addAdvertCategory) {
	elem_addAdvertCategory.addEventListener('change', e => {
		let target = e.target;
		let value = target.value;
		changeAdvert.insertListSubcategories(value);
	});

	elem_addAdvertCategory.addEventListener('mouseover', () => {
		elem_description.textContent = 'Будь ласка, виберіть потрібну категорію.';
	});

	elem_addAdvertCategory.addEventListener('mouseout', () => {
		elem_description.textContent = '';
	});
}

if (elem_addAdvertSubcategory) {
	elem_addAdvertSubcategory.addEventListener('mouseover', () => {
		elem_description.textContent = 'Будь ласка, виберіть потрібну підкатегорію.';
	});

	elem_addAdvertSubcategory.addEventListener('mouseout', () => {
		elem_description.textContent = '';
	});
}

if (but_crossNewAd) {
	but_crossNewAd.onclick = function() {
		closeWindow(window_newAdvert);//The function is in the file authorization.js
		openWindow(window_mainContent);//The function is in the file authorization.js
		clearFieldsForm(form_newAd);//The function is in the file javascript.js

		for (let elem of allBut_addPhoto) {
			if (elem.firstElementChild) {
				blockPhoto.pressButton = this;
				blockPhoto.createFormData();
				break;
			}
		}

		if (this.dataset.statusWindow == 'updateAdvert') changeAdvert.changeViewWindow();
	}
}

allBut_addPhoto.forEach(item => {
	item.onclick = e => {
		e.preventDefault();
		
		if (e.target.tagName == 'BUTTON') {
			blockPhoto.pressButton = e.target;
			blockPhoto.findEmptyButton();
		} else {
			blockPhoto.pressButton = e.target.parentElement;
			blockPhoto.createFormData();
		}
	};
});

if (appendPhoto) {
	appendPhoto.onchange = () => blockPhoto.createFormData();
}

if (window_newAdvert) {
	window.addEventListener('scroll', () => {

		if (window.pageYOffset > header.clientHeight) {
			elem_description.style.marginTop = window.pageYOffset - header.clientHeight + 'px';
		}
	});
}


if (but_sendAd) {
	but_sendAd.onclick = function() {
		sendAdvert.collectData(this);
	};
}