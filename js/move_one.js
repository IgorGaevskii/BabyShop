// Module files are located under /js/module in the project — use absolute paths from web root
import checkSymbol from "/js/module/checkSymbol.js";
import clearFieldsForm from "/js/module/clearFieldsForm.js";
import checkFieldsForm from "/js/module/checkFieldsForm.js";
import {removeElementError, removeElementsError} from "/js/module/removeElementError.js";
import collectDataForServer from "/js/module/collectDataForServer.js";

const window_registrationMoveOne = document.querySelector('.content'),
	form = document.forms.registrationMoveOne,
	field_emailUser = form.elements.email,
	field_passwordUser = form.elements.password_user,
	field_repeatPassword = form.elements.repeatPassword,
	field_checkbox = form.elements.consent,
	elem_eyeSwitch = window_registrationMoveOne.querySelector('.eye-switch'),
	but_registrationMoveOne = window_registrationMoveOne.querySelector('#but-registration-move-one');

	//Checking the entered characters in the "email" field
	field_emailUser.onfocus = function() {
		removeElementError(this);
		checkSymbol(this);
	}

	field_emailUser.onpaste = () => {
		return false;
	}

	//Checking the entered characters in the "password" field
	field_passwordUser.onfocus = function() {
		let elem = this.closest('.wrap-field-password');
		removeElementError(elem);
		checkSymbol(this);
		// elem_descriptionMoveOne.innerHTML = "<p>Пароль повинен містити від 8 до 24 символів, мати не менш 2 букв у верхньому регістрі та 2 цифр.</p>";
	}

	field_passwordUser.onpaste = () => {
		return false;
	}

	field_checkbox.onclick = function() {
		let elem = this.closest('.wrap-checkbox');
		removeElementError(elem);
	}

	elem_eyeSwitch.onclick = function() {
		let elem_img = this.firstElementChild;

		if (field_passwordUser.type == 'password') {
			field_passwordUser.type = 'text';
			field_repeatPassword.type = 'text';
			elem_img.src = '/pictures/icon hide.png';
		} else {
			field_passwordUser.type = 'password';
			field_repeatPassword.type = 'password';
			elem_img.src = '/pictures/icon show.png';
		}
	}

	//Checking the entered characters in the "repeatPassword" field
	field_repeatPassword.onfocus = function() {
		removeElementError(this);
		checkSymbol(this);
	}

	field_repeatPassword.onpaste = () => {
		return false;
	}

	// Check and submit data in server form registration move one
	but_registrationMoveOne.addEventListener('click', (event) => {
		event.preventDefault();
		removeElementsError();
		
		if ( checkFieldsForm(form.elements) ) collectDataForServer(form);
	});