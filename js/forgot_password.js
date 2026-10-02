// import {closeWindow, openWindow} from "./module/open&closeWindow.js";
import clearFieldsForm from "/js/module/clearFieldsForm.js";
import checkFieldsForm from "/js/module/checkFieldsForm.js";
import {removeElementError, removeElementsError} from "/js/module/removeElementError.js";
import checkSymbol from "/js/module/checkSymbol.js";
import collectDataForServer from "/js/module/collectDataForServer.js";

const modalWindow_forgotPassword  = document.querySelector('.content'),
	form = modalWindow_forgotPassword.querySelector('form'),
	field_emailUser = form.elements.email,
	field_passwordUser_FP = form.elements.password_user,
	field_repeatPassword_FP = form.elements.repeatPassword,
	elem_eyeSwitch = modalWindow_forgotPassword.querySelector('.eye-switch'),
	but_forgotPassword = modalWindow_forgotPassword.querySelector('#but-forgot_password');

field_emailUser.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
}

field_emailUser.onpaste = () => {
	return false;
}

field_passwordUser_FP.onfocus = function() {
	let elem = this.closest('.wrap-field-password');
	removeElementError(elem);
	checkSymbol(this);
}

field_passwordUser_FP.onpaste = () => {
	return false;
}

field_repeatPassword_FP.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
}

field_repeatPassword_FP.onpaste = () => {
	return false;
}

elem_eyeSwitch.onclick = function() {
	let elem_img = this.firstElementChild;

	if (field_passwordUser_FP.type == 'password') {
		field_passwordUser_FP.type = 'text';
		field_repeatPassword_FP.type = 'text';
		elem_img.src = '/pictures/icon hide.png';
	} else {
		field_passwordUser_FP.type = 'password';
		field_repeatPassword_FP.type = 'password';
		elem_img.src = '/pictures/icon show.png';
	}
}
	
but_forgotPassword.addEventListener('click', () => {
	event.preventDefault();
	removeElementsError();

	if ( checkFieldsForm(form.elements) ) collectDataForServer(form);
})