import collectDataForServer from "./collectDataForServer.js";
import createElemError from "./createElemError.js";

export default function checkFieldsForm(form) {
	const obj = {
		nameError: {
			one: 'Перевірте правильність введення Email та пароля.',
			two: 'Введений e-mail не валідний. Будь ласка! Введіть інший e-mail.',
			three: 'Довжина пароля має бути від 8 до 24 символів.',
			four: 'Пароль повинен містити не менш 2 числових і 2 літерних символів у верхньому регістрі.',
			five: 'Паролі не збігаються.',
			six: "Ім'я має починатися з великої літери.",
			seven: 'Прізвище має починатися з великої літери.',
			eight: 'Неправильний формат введення!',
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

	function checkValidData(form, field) {
		//Проверка валидности email
		if (field.name == 'email') {
			let valueFieldEmail = field.value;
			let numberCoincidences = 0;

			//Count number symbol @
			for (let i = 0; i < valueFieldEmail.length; i++) {

				if (valueFieldEmail[i] == "@") {
					numberCoincidences += 1;
				}
			}

			if (valueFieldEmail[0] == "@" || numberCoincidences != 1) {
				obj[field.name].valid = false;
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.two;

			} else {
				let sliceString = valueFieldEmail.slice( valueFieldEmail.indexOf("@") );

				if (sliceString.indexOf(".") == -1 || sliceString.indexOf(".") < 2) {
					obj[field.name].valid = false;
					return field.closest('#authorization')? obj.nameError.one: obj.nameError.two;
				}
			}

		} else if (field.name == 'password_user') {
			//Проверка валидности password
			let valueFieldPassword = field.value;

			if (valueFieldPassword.length < 8 || valueFieldPassword.length > 24) {
				obj[field.name].valid = false;
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.three;

			} else if ( checkNumberSymbol(valueFieldPassword) ) {
				obj[field.name].valid = false;
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.four;
			}

		} else if (field.name == 'repeatPassword') {
			let valueFieldPassword = form.querySelector("input[name='password_user']").value;

			if (field.value !=  valueFieldPassword) {
				obj[field.name].valid = false;
				return obj.nameError.five;
			}

		} else if (field.name == 'consent' && !field.checked) {
			obj[field.name].valid = false;
			return obj.nameError.nine;

		} else if (field.name == 'first_name' || field.name == 'surname') {
			let symbol = field.value[0];

			if (!/^[А-ЩЬЮЯЄІЇҐ]+$/.test(symbol)) {
				return field.name == 'first_name'? obj.nameError.six: obj.nameError.seven;
			}

		} else if (field.name == 'phone') {
			let valueFieldPhone = field.value;

			if (valueFieldPhone.length != 17) {
				return obj.nameError.eight;
			}
		}
	}

	let allFieldsForm = form.querySelectorAll('input');

	for (let field of allFieldsForm) {
		obj[field.name] = {};

		if (field.name != 'user-avatar') {
			
			if (!field.value) {
				obj[field.name].empty = true;

				if ( !field.closest('#authorization') ) createElemError(field, 'Введите пожалуйста данные');

			} else {
				obj[field.name].empty = false;
				let answer = checkValidData(form, field); //Check validation of entered data

				if ( !Boolean(answer) ) {
					obj[field.name].valid = true;
				} else if ( field.closest('#authorization') ) {
					showModalWindow(answer);
				} else {
					createElemError(field, answer);
				}
			}

		} else {
			obj[field.name].empty = false;
			obj[field.name].valid = true;
		}
	}

	if ( !obj.checkError() ) collectDataForServer(form);
}