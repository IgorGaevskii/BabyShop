import {removeElementError, removeElementsError} from "./module/removeElementError.js";
import checkSymbol from "./module/checkSymbol.js";
import checkFieldsForm from "./module/checkFieldsForm.js";
import {closeWindow} from "./module/open&closeWindow.js";
import deleteChildNodes from "./module/deleteChildNodes.js";

const form_registrationMoveTwo = document.forms.registrationMoveTwo,
	elem_inputPhone = form_registrationMoveTwo.elements.phone,
	btn_chooseAvatar = form_registrationMoveTwo.querySelector('.btn-choose-avatar'),
	elem_inputFile = form_registrationMoveTwo.querySelector('.input-file'),
	elem_nameFile = form_registrationMoveTwo.querySelector('span'),

	window_registrationMoveTwo = document.querySelector('.content'),
	elem_descriptionMoveTwo = window_registrationMoveTwo.querySelector('.description'),
	elem_areaChooseAvatar = window_registrationMoveTwo.querySelector('.area-сhoose-avatar'),
	but_registrationMoveTwo = window_registrationMoveTwo.querySelector('#but-registration-move-two');

//Checking the entered characters in the "name" field
document.querySelector("input[name='first_name'].field-registration").onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveTwo.innerHTML = "<p>Ім'я повинне починатися з великої літери.</p>";
}

//Checking the entered characters in the "surname" field
document.querySelector("input[name='surname'].field-registration").onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveTwo.innerHTML = "<p>Прізвище повинне починатися з великої літери.</p>";
}

elem_inputPhone.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveTwo.innerHTML = "<p>Телефон повинен мати наступний формат:<br> +38(0XX)XXX-XX-XX.</p>";

	if (this.value.length >= 5) return;

	this.value = '+38(0';
}

elem_inputPhone.onblur = function() {

	if (this.value.length == 5) this.value = '';
}

elem_inputPhone.oninput = function(event) {
	let valueElem = this.value;

	if (event.keyCode != 8) {

		if (valueElem.length == 3) {
			valueElem += "(";
			elem_inputPhone.value = valueElem;
		} else if (valueElem.length == 7) {
			valueElem += ")";
			elem_inputPhone.value = valueElem;
		} else if (valueElem.length == 11) {
			valueElem += "-";
			elem_inputPhone.value = valueElem;
		} else if (valueElem.length == 14) {
			valueElem += "-";
			elem_inputPhone.value = valueElem;
		}
	}
}

// Check and submit data in server form registration move two
but_registrationMoveTwo.onclick = function() {
	event.preventDefault();
	removeElementsError();
	checkFieldsForm(form_registrationMoveTwo);
};

btn_chooseAvatar.addEventListener('click', () => {
	event.preventDefault();
	removeElementError(elem_areaChooseAvatar);
	elem_inputFile.click();

})

elem_inputFile.onchange = function() {
	let nameFile = this.files[0].name;
	elem_nameFile.textContent = nameFile;
}