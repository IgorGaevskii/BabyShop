import {removeElementError, removeElementsError} from "./module/removeElementError.js";
import checkSymbol from "./module/checkSymbol.js";
import checkFieldsForm from "./module/checkFieldsForm.js";
import {modalWindow} from "./module/open&closeWindow.js";
import deleteChildNodes from "./module/deleteChildNodes.js";

const form = document.forms.registrationMoveTwo,
	input_name = form.elements.first_name,
	input_surname = form.elements.surname,
	input_phone = form.elements.phone,
	input_region = form.elements.region,
	input_district = form.elements.district,
	input_city = form.elements.city,
	elem_slider = form.querySelector('.slider'),
	elem_inputFile = form.querySelector('.input-file'),
	elem_nameFile = form.querySelector('span'),
	elem_areaChooseAvatar = form.querySelector('.сhoose-avatar'),
	img_avatarStep3 = form.querySelector('.space-avatar img'),
	fieldset_checkData = form.querySelector('.check-data'),
	img_avatarStep4 = fieldset_checkData.querySelector('img'),
	p_fullName = form.querySelector('.full-name'),
	btn_chooseAvatar = form.querySelector('.btn-choose-avatar'),
	but_submit = form.querySelector('.but-submit'),
	window_popup = document.querySelector('.popup'),
	message_popup = window_popup.querySelector('.message'),
	but_popup = window_popup.querySelector('.but-window');

const slider = {
	moveSlider: 0,

	moveSliderLeft() {
		this.moveSlider -= 100;
		elem_slider.style.left = this.moveSlider + '%';
	},

	moveSliderRight() {
		this.moveSlider += 100;
		elem_slider.style.left = this.moveSlider + '%';
	},

	getAllFieldsPage(elem) {
		let parentElem = elem.closest('.page-slider');
		let allInputPage = parentElem.querySelectorAll('input');
		return allInputPage;
	},

	assignHandler() {
		form.querySelectorAll('.but-further').forEach(item => {
			item.onclick = function() {
				let allFields = slider.getAllFieldsPage(this);
				
				if  (this.classList.contains('area') ) clearListAreas(allFields);

				if ( checkFieldsForm(allFields) ) {
					slider.moveSliderLeft();
				} else {
					this.disabled = true;
					return;
				}
			}
		});

		form.querySelectorAll('.but-back').forEach(item => item.onclick = function() {
			slider.moveSliderRight();
		});
	}
};

let answerServer = null;
let territory = new Set();

function clearListAreas(allFields) {
	allFields.forEach(item => {
		let elem = item.nextElementSibling;

		if ( elem.classList.contains('list-area') ) {
			elem.style.display = 'none';
			elem.innerHTML = '';
		}
		
	})
}

function updatePreviewData(elem) {

	if (elem.name === 'region') {
		fieldset_checkData.querySelector('.region strong').textContent = elem.value;
	} else if (elem.name === 'district') {
		fieldset_checkData.querySelector('.district strong').textContent = elem.value;
	} else if (elem.name === 'city') {
		fieldset_checkData.querySelector('.city strong').textContent = elem.value;
	}
};

function changeArea() {
	let area = null;
	let inputField = {value: ''};
	let valueInput = this.value.toLowerCase();
	let ul_listArea = this.nextElementSibling;
	ul_listArea.innerHTML = '';
	inputField.value = this.value;

   // Изменение (исправление) области
   if (!valueInput && this.name == 'region') {
   	input_district.value = '';
   	input_city.value = '';
   }

   // Изменение (исправление) района
   if (!valueInput && this.name == 'district') {
   	input_city.value = '';
   }

   let filtered = Array.from(territory).filter( item => item.toLowerCase().startsWith(valueInput) );

   if (filtered.length > 0 && valueInput) {
   	filtered.forEach(areaItem => {
   		let li = document.createElement('li');
   		li.classList.add('item-list');
   		li.textContent = areaItem;
			// Клик по варианту
			li.addEventListener('click', () => {
			 	this.value = areaItem;
			 	inputField.value = areaItem;
				ul_listArea.style.display = 'none';
				updatePreviewData(this);
			});
			ul_listArea.appendChild(li);
		});
		ul_listArea.style.display = 'block';
   } else {
		ul_listArea.style.display = 'none';
   }

   updatePreviewData(this);
}

function checkButtonStatus(input) {
	let parentElem = input.closest('fieldset');
	let all_error = parentElem.querySelectorAll('.error');

	if (!all_error.length) parentElem.querySelector('.but-further').disabled = false;
}

function insertSymbol(value, cursor, symbol) {
	let leftPart = value.slice(0, cursor - 1);
	let rightPart = value.slice(cursor);
	return leftPart + symbol + rightPart;
}

//Checking the entered characters in the "name" field
input_name.addEventListener('focus', e => {
	let elem = e.target;
	removeElementError(elem);
	checkSymbol(elem);
	checkButtonStatus(elem);
});

input_name.addEventListener('change', e => {
	let elem = e.target;
	let text = elem.value;
	p_fullName.querySelector('.name').textContent = text;
})

//Checking the entered characters in the "surname" field
input_surname.addEventListener('focus', e => {
	let elem = e.target;
	removeElementError(elem);
	checkSymbol(elem);
	checkButtonStatus(elem);
});

input_surname.addEventListener('change', e => {
	let elem = e.target;
	let text = elem.value;
	p_fullName.querySelector('.surname').textContent = text;
});

input_phone.addEventListener('focus', e => {
	let elem = e.target;
	removeElementError(elem);
	checkSymbol(elem);
	checkButtonStatus(elem);

	if (elem.value.length >= 5) return;

	elem.value = '+38(0';
});

input_phone.addEventListener('blur', e => {
	let elem = e.target;

	if (elem.value.length == 5) elem.value = '';
});

input_phone.addEventListener('input', function() {
	let valueElem = this.value;
	let positionCursor = this.selectionStart;

	if (valueElem.length == 7 && positionCursor == 7) {
		valueElem += ") ";
		this.value = valueElem;
	} else if (valueElem.length == 12 && positionCursor == 12) {
		valueElem += "-";
		this.value = valueElem;
	} else if (valueElem.length == 15 && positionCursor == 15) {
		valueElem += "-";
		this.value = valueElem;
	} else if (valueElem.length <= 18 && (positionCursor == 16 || positionCursor == 13) && valueElem[positionCursor - 1] != '-') {
		this.value = insertSymbol(valueElem, positionCursor, '-')
		this.setSelectionRange(positionCursor, positionCursor);
	} else if (valueElem.length <= 18 && positionCursor == 9 && valueElem[positionCursor - 1] != ' ') {
		this.value = insertSymbol(valueElem, positionCursor, ' ');
		this.setSelectionRange(positionCursor, positionCursor);
	} else if (valueElem.length <= 18 && positionCursor == 8 && valueElem[positionCursor - 1] != ')') {
		this.value = insertSymbol(valueElem, positionCursor, ')');
		this.setSelectionRange(positionCursor, positionCursor);
	}
});

input_phone.addEventListener('keydown', function(e) {
	const cursor = this.selectionStart;
	const value = this.value;

	if (e.key === 'Backspace') {
		// Разрешено стирать до префикса
		if (cursor <= 5) {
			e.preventDefault();
			return;
		}

		// Стирание с конца без преград
		if (cursor === value.length) {
			e.preventDefault();
			this.value = value.slice(0, -1);
			return;
		}
	}
});

input_phone.addEventListener('change', e => {
	let elem = e.target;
	let numPhone = elem.value;
	fieldset_checkData.querySelector('.phone strong').textContent = numPhone;
});

input_region.addEventListener('focus', function() {
	territory.clear();
	answerServer.forEach( item => territory.add(item.name_region) );

	removeElementError(this);
	checkSymbol(this);
	checkButtonStatus(this);
	clearListAreas( slider.getAllFieldsPage(this) );
})

input_region.addEventListener('input', changeArea);

input_district.addEventListener('focus', function() {

	if (input_region.value) {
		territory.clear();
		answerServer.forEach( item => {
			if (input_region.value.toLowerCase() == item.name_region.toLowerCase()) territory.add(item.name_district);
		});
	} else {
		this.blur();
		return;
	}

	removeElementError(this);
	checkSymbol(this);
	checkButtonStatus(this);
	clearListAreas( slider.getAllFieldsPage(this) );
})

input_district.addEventListener('input', changeArea);

input_city.addEventListener('focus', function() {

	if (input_region.value && input_district.value) {
		territory.clear();
		answerServer.forEach( item => {
			if (input_region.value.toLowerCase() == item.name_region.toLowerCase() 
				&& input_district.value.toLowerCase() == item.name_district.toLowerCase()
				) territory.add(item.name_city);
		});
	} else {
		this.blur();
		return;
	}

	removeElementError(this);
	checkSymbol(this);
	checkButtonStatus(this);
	clearListAreas( slider.getAllFieldsPage(this) );
})

input_city.addEventListener('input', changeArea);

// Check and submit data in server form registration move two

// --- 2. ЛОГИКА ОТПРАВКИ ДАННЫХ (КНОПКА "ВІДПРАВИТИ") ---
but_submit.onclick = async function(event) {
	event.preventDefault();

	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token'); // "admin"

	const formData = new FormData(form);
	formData.append('token', token);

	// Добавляем файл аватара (если он был выбран)
	if (elem_inputFile.files[0]) {
		formData.append('user_avatar', elem_inputFile.files[0]);
	}

	try {
        let response = await fetch('/php/registration user move two.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            let result = await response.json();

            if (result.status === 'success') {
                // Если сервер вернул новый путь к фото (с токеном)
                if (result.src) {
                    const cacheBuster = "?t=" + new Date().getTime();
                    img_avatarStep3.src = result.src + cacheBuster;
                    img_avatarStep4.src = result.src + cacheBuster;
                }

                message_popup.textContent = "Регистрация успешно завершена!";
                modalWindow.open = window_popup;
            } else {
                alert("Ошибка: " + (result.error || result.problem));
            }
        }
    } catch (err) {
        console.error("Ошибка при отправке формы:", err);
    }
};

btn_chooseAvatar.addEventListener('click', () => {
	event.preventDefault();
	removeElementError(elem_areaChooseAvatar);
	elem_inputFile.click();

})

// --- 1. ЛОГИКА ВЫБОРА ФОТО (ПРЕВЬЮ) ---
elem_inputFile.onchange = function() {
    const file = this.files[0];
    if (file) {
        // Создаем локальную ссылку для мгновенного отображения (без сервера)
        const localUrl = URL.createObjectURL(file);
        
        // Обновляем картинку в обоих местах
        img_avatarStep3.src = localUrl;
        img_avatarStep4.src = localUrl;
        
        // Обновляем текст с именем файла
        elem_nameFile.textContent = file.name;
    }
};

slider.assignHandler();

document.addEventListener("DOMContentLoaded", async function () {
	let response = await fetch("/php/town.php");

	if (response.ok) { //проверяем статус ответа сервера
		answerServer = await response.json(); //получаем тело ответа (декодируем JSON-строку в массив)
	} else {
		alert(`Ошибка HTTP: ${response.status}`); //выводим ошибку
	}
});