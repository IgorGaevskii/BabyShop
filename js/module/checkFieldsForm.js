import createElemError from "./createElemError.js";
import showModalWindow from "./showModalWindow.js";

export default function checkelemsForm(allElementsForm) {
	const obj = {
		nameError: {
			one: 'Перевірте правильність введення Email та пароля.',
			two: 'Введений e-mail не валідний. Будь ласка! Введіть інший e-mail.',
			three: 'Довжина пароля має бути від 8 до 24 символів.',
			four: 'Пароль повинен містити не менш 2 числових і 2 літерних символів у верхньому регістрі.',
			five: 'Паролі не збігаються.',
			six: "Ім'я має починатися з великої літери.",
			seven: 'Прізвище має починатися з великої літери.',
			eight: 'Не відповідає шаблону:<br>+38(0ХХ) ХХХ-ХХ-ХХ',
			nine: 'Дайте згоду.'
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

	function checkNumberSymbol(valueelemPassword) {
		let stringSymbol = 0;
		let numberSymbol = 0;

		for (let i = 0; i < valueelemPassword.length; i++) {
			let codeSymbolUTF = valueelemPassword.codePointAt(i);

			if (codeSymbolUTF > 64 && codeSymbolUTF < 91) {
				stringSymbol++;
			}

			if (codeSymbolUTF > 47 && codeSymbolUTF < 58) {
				numberSymbol++;
			}
		}

		return (stringSymbol >= 2 && numberSymbol >= 2)? 0: 1;
	}

	function checkValidData(elem) {
		//Проверка валидности email
		if (elem.name == 'email') {
			let email = elem.value;

			if  ( !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ) {
				return elem.closest('#authorization')? obj.nameError.one: obj.nameError.two;
			}

		} else if (elem.name == 'password_user') {
			//Проверка валидности password
			let valueelemPassword = elem.value;

			if (valueelemPassword.length < 8 || valueelemPassword.length > 24) {
				return elem.closest('#authorization')? obj.nameError.one: obj.nameError.three;
			} else if ( checkNumberSymbol(valueelemPassword) ) {
				return elem.closest('#authorization')? obj.nameError.one: obj.nameError.four;
			}

		} else if (elem.name == 'repeatPassword') {
			let form = elem.form;
			let valueelemPassword = form.querySelector("input[name='password_user']").value;

			if (elem.value !=  valueelemPassword) {
				return obj.nameError.five;
			}

		} else if (elem.name == 'consent' && !elem.checked) {
			return obj.nameError.nine;

		} else if (elem.name == 'first_name' || elem.name == 'surname' || elem.name == 'region' || elem.name == 'district' || elem.name == 'city') {
			let symbol = elem.value[0];

			if (!/^[А-ЩЬЮЯЄІЇҐ]+$/.test(symbol)) {

				switch(elem.name) {
					case 'first_name':
						return obj.nameError.six;
						break;
					case 'surname':
						return obj.nameError.seven;
						break;
					case 'region':
						return 'Назва області має починатися з великої літери';
						break;
					case 'district':
						return 'Назва району має починатися з великої літери';
						break;
					case 'city':
						return 'Назва міста має починатися з великої літери';
						break;
				}
			}

		} else if (elem.name == 'phone') {
			let valueelem = elem.value;

			if (valueelem.length != 18) {
				return obj.nameError.eight;
			}
		}
	}

	for (let i = 0; i < allElementsForm.length; i++) {
		let elem = allElementsForm[i];

		if (elem.tagName === 'BUTTON' || elem.tagName === 'FIELDSET') continue;

		obj[elem.name] = {};

		if (elem.name != 'user-avatar') {
			
			if (!elem.value) {
				obj[elem.name].empty = true;

				if ( !elem.closest('#authorization') ) createElemError(elem, 'Введите пожалуйста данные');

			} else {
				obj[elem.name].empty = false;
				let answer = checkValidData(elem); //Check validation of entered data

				if ( !Boolean(answer) ) {
					obj[elem.name].valid = true;
				} else if ( elem.closest('#authorization') ) {
					showModalWindow(answer);
				} else {
					obj[elem.name].valid = false;
					createElemError(elem, answer);
				}
			}

		} else {
			obj[elem.name].empty = false;
			obj[elem.name].valid = true;
		}
	}

	return !obj.checkError()? true: false;
}