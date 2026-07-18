import createElemError from "./createElemError.js";
import showModalWindow from "./showModalWindow.js";

export default function checkFieldsForm(allFieldsForm) {
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

	function checkNumberSymbol(valueFieldPassword) {
		let stringSymbol = 0;
		let numberSymbol = 0;

		for (let i = 0; i < valueFieldPassword.length; i++) {
			let codeSymbolUTF = valueFieldPassword.codePointAt(i);

			if (codeSymbolUTF > 64 && codeSymbolUTF < 91) {
				stringSymbol++;
			}

			if (codeSymbolUTF > 47 && codeSymbolUTF < 58) {
				numberSymbol++;
			}
		}

		return (stringSymbol >= 2 && numberSymbol >= 2)? 0: 1;
	}

	function checkValidData(field) {
		//Проверка валидности email
		if (field.name == 'email') {
			let email = field.value;

			if  ( !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ) {
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.two;
			}

		} else if (field.name == 'password_user') {
			//Проверка валидности password
			let valueFieldPassword = field.value;

			if (valueFieldPassword.length < 8 || valueFieldPassword.length > 24) {
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.three;
			} else if ( checkNumberSymbol(valueFieldPassword) ) {
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.four;
			}

		} else if (field.name == 'repeatPassword') {
			let form = field.form;
			let valueFieldPassword = form.querySelector("input[name='password_user']").value;

			if (field.value !=  valueFieldPassword) {
				return obj.nameError.five;
			}

		} else if (field.name == 'consent' && !field.checked) {
			return obj.nameError.nine;

		} else if (field.name == 'first_name' || field.name == 'surname' || field.name == 'region' || field.name == 'district' || field.name == 'city') {
			let symbol = field.value[0];

			if (!/^[А-ЩЬЮЯЄІЇҐ]+$/.test(symbol)) {

				switch(field.name) {
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

		} else if (field.name == 'phone') {
			let valueField = field.value;

			if (valueField.length != 18) {
				return obj.nameError.eight;
			}
		}
	}

	for (let field of allFieldsForm) {
		obj[field.name] = {};

		if (field.name != 'user-avatar') {
			
			if (!field.value) {
				obj[field.name].empty = true;

				if ( !field.closest('#authorization') ) createElemError(field, 'Введите пожалуйста данные');

			} else {
				obj[field.name].empty = false;
				let answer = checkValidData(field); //Check validation of entered data

				if ( !Boolean(answer) ) {
					obj[field.name].valid = true;
				} else if ( field.closest('#authorization') ) {
					showModalWindow(answer);
				} else {
					obj[field.name].valid = false;
					createElemError(field, answer);
				}
			}

		} else {
			obj[field.name].empty = false;
			obj[field.name].valid = true;
		}
	}

	return !obj.checkError()? true: false;
}