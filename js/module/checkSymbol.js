import showModalWindow from "./showModalWindow.js";
import createElemError from "./createElemError.js";

export default function checkSymbol(elem) {
	let fun;

	if (elem.name == "email") {
		fun = (symbol) => {
			let codeSymbolUTF = symbol.codePointAt(0);

			if ( (codeSymbolUTF > 63 && codeSymbolUTF < 91) || (codeSymbolUTF > 96 && codeSymbolUTF < 123) || 
				(codeSymbolUTF > 47 && codeSymbolUTF < 58) || codeSymbolUTF == 45 || codeSymbolUTF == 46) {
				return 1;
			} else if (codeSymbolUTF == 32 || codeSymbolUTF == 44) {
				elem.closest('#authorization')? 
					showModalWindow('Введено неприпустимий символ!', elem): 
					createElemError(elem, 'Введено неприпустимий символ!');
				elem.blur();
				return 0;
			} else {
				elem.closest('#authorization')? 
					showModalWindow('Змініть розкладку<br>клавіатури!', elem): 
					createElemError(elem, 'Змініть розкладку клавіатури!');
				elem.blur();
				return 0;
			}
		}

	} else if (elem.name == 'password_user' || elem.name == 'repeatPassword' || elem.name == 'password') {
		fun = (symbol) => {
			let codeSymbolUTF = symbol.codePointAt(0);

			if ( (codeSymbolUTF > 63 && codeSymbolUTF < 91) || (codeSymbolUTF > 96 && codeSymbolUTF < 123) ||
				(codeSymbolUTF > 47 && codeSymbolUTF < 58) ) {
				return 1;
			} else if (codeSymbolUTF == 32 || codeSymbolUTF == 44) {
				elem.closest('#authorization')? 
					showModalWindow('Введено неприпустимий символ!', elem): 
					createElemError(elem, 'Введено неприпустимий символ!');
				elem.blur();
				return 0;
			} else {
				elem.closest('#authorization')?
					showModalWindow('Змініть розкладку клавіатури!', elem):
					createElemError(elem, 'Змініть розкладку клавіатури!');
				elem.blur();
				return 0;
			}
		}

	} else if (elem.name == 'first_name' || elem.name == 'surname') {
		// Разрешённые служебные клавиши
		const allowedKeys = ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"];
		fun = (symbol) => {
			return /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ'’]+$/.test(symbol) // Разрешаем символы украинского алфовита
			|| allowedKeys.includes(symbol); // Разрешаем служебные клавиши
		}
	} else if (elem.name == 'phone') {
		// Разрешённые служебные клавиши
		const allowedKeys = ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", "Shift", " "];
		fun = (symbol) => {
			return /^[0-9()-]+$/.test(symbol) // Разрешаем ввод только цифр
			|| allowedKeys.includes(symbol); // Разрешаем служебные клавиши 
		}
	} else if (elem.name == 'region' || elem.name == 'district' || elem.name == 'city') {
		const allowedKeys = ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", "Shift", " "];
		fun = (symbol) => {
			return /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ'’-]+$/.test(symbol) // Разрешаем символы украинского алфовита
			|| allowedKeys.includes(symbol); // Разрешаем служебные клавиши
		}
	}

	elem.onkeydown = function(event) {
		return fun(event.key)? true: event.preventDefault();
	}
}