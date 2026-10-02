import {window_mainContent, allItemsMenu, window_newAdvert, headingName, form_newAd, nameGoodsInput, priceGoodsInput, descriptionGoodsTextarea} from "./module/variables.js";
import {closeWindow, openWindow} from './module/open&closeWindow.js';
import deleteChildNodes from "./module/deleteChildNodes.js";
import clearFieldsForm from "./module/clearFieldsForm.js";
import {createCardGoods} from "./user advert.js";
import {panelControl} from "./module/panel control.js";
import showModalWindow from "./module/showModalWindow.js";

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

const photoSlots = Array.from({length: allBut_addPhoto.length}, () => null);

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

		if ( !photoSlots.some(Boolean) ) {
			showModalWindow('Додайте принаймні одне фото товару.');
			return;
		}

		const firstEmptyPhotoIndex = photoSlots.findIndex(slot => !slot);
		if (firstEmptyPhotoIndex !== -1 && photoSlots.slice(firstEmptyPhotoIndex).some(Boolean)) {
			showModalWindow(`Будь ласка, <br>вставте зображення<br> товару в ${firstEmptyPhotoIndex + 1} поле.`);
			return;
		}

		formData.append('photo_slots', JSON.stringify(photoSlots.map(slot => {
			if (!slot) return null;
			return slot.file ? {type: 'new', index: slot.index} : {type: 'existing', src: slot.src};
		})));

		photoSlots.forEach((slot, index) => {
			if (slot?.file) formData.append(`photo_files[${index}]`, slot.file, slot.file.name);
		});

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
		this.clear();
		(arr || []).slice(0, allBut_addPhoto.length).forEach((src, index) => {
			if (src) photoSlots[index] = {src, existing: true};
		});
		this.render();
	},

	clear() {
		photoSlots.forEach(slot => {
			if (slot?.preview) URL.revokeObjectURL(slot.preview);
		});
		photoSlots.fill(null);
		this.render();
	},

	render() {
		allBut_addPhoto.forEach((button, index) => {
			deleteChildNodes(button);
			const slot = photoSlots[index];
			if (slot) {
				const image = document.createElement('img');
				image.src = slot.preview || slot.src;
				image.width = 70;
				image.height = 70;
				image.alt = `Фото товара ${index + 1}`;
				button.appendChild(image);
				button.dataset.action = 'removePhoto';
			} else {
				button.textContent = String(index + 1);
				button.dataset.action = 'appendPhoto';
			}
		});
	},

	findEmptyButton() {
		this.indexButton = Array.from(allBut_addPhoto).findIndex(item => 
			(item.dataset.action == 'appendPhoto') ) + 1;
		this.checkPressButton();
	},

	checkPressButton() {

		if (Number(this.pressButton.dataset.numberbutton) != this.indexButton) {
			showModalWindow(`Будь ласка,<br>вставте зображення<br>товару в ${this.indexButton} поле.`);
		} else {
			appendPhoto.click();
		}
	},

	selectFile() {
		const file = appendPhoto.files[0];
		appendPhoto.value = '';
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			showModalWindow('Оберіть файл зображення.');
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			showModalWindow('Розмір одного<br>зображення не повинен<br>перевищувати 10 МБ.');
			return;
		}

		const slotIndex = this.indexButton - 1;
		if (slotIndex < 0 || slotIndex >= photoSlots.length || photoSlots[slotIndex]) return;

		photoSlots[slotIndex] = {
			file,
			index: slotIndex,
			preview: URL.createObjectURL(file)
		};
		this.render();
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
			blockPhoto.clear();

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
								`<div class='card' data-article="${item.article}">
									<img src='${item.src}' width='230' height='230'>
									<p class="card__name">${item.title}</p>
									<p class="card__code">Код товара: <span class="code-number">${item.article}</span></p>
									<p class="card__price">Цена: ${item.price} гр</p>
								</div>`);
						});
					}
				}
				showModalWindow('Оголошення успішно<br>додано.');
				
			} else {
				closeWindow(window_newAdvert);
				openWindow(window_userAds);
				showModalWindow('Оголошення успішно<br>змінено.');
				let parent = panelControl.pressedButton?.closest('.active_ads, .inactive_ads');
				if (parent?.classList.contains('active_ads')) {
					if (inputHatActiveAds) inputHatActiveAds.checked = false;
				} else if (parent?.classList.contains('inactive_ads')) {
					if (inputHatInactiveAds) inputHatInactiveAds.checked = false;
				}
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
		blockPhoto.clear();

		if (this.dataset.statusWindow == 'updateAdvert') changeAdvert.changeViewWindow();
	}
}

allBut_addPhoto.forEach(item => {
	item.onclick = e => {
		e.preventDefault();
		const button = e.currentTarget;
		const slotIndex = Number(button.dataset.numberbutton) - 1;

		if (photoSlots[slotIndex]) {
			if (photoSlots[slotIndex].preview) URL.revokeObjectURL(photoSlots[slotIndex].preview);
			photoSlots[slotIndex] = null;
			blockPhoto.render();
			return;
		}

		blockPhoto.pressButton = button;
		blockPhoto.findEmptyButton();
	};
});

if (appendPhoto) {
	appendPhoto.accept = 'image/*';
	appendPhoto.onchange = () => blockPhoto.selectFile();
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