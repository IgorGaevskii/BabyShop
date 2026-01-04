// import {closeWindow, openWindow} from "./module/open&closeWindow.js";
import clearFieldsForm from "/js/module/clearFieldsForm.js";
import checkFieldsForm from "/js/module/checkFieldsForm.js";
import {removeElementError, removeElementsError} from "/js/module/removeElementError.js";
import checkSymbol from "/js/module/checkSymbol.js";

const modalWindow_forgotPassword  = document.querySelector('.content'),
	form_forgotPassword = modalWindow_forgotPassword.querySelector('form'),
	field_emailUser_FP = form_forgotPassword.elements.email_user,
	field_passwordUser_FP = form_forgotPassword.elements.password_user,
	field_repeatPassword_FP = form_forgotPassword.elements.repeatPassword,
	elem_eyeSwitch = modalWindow_forgotPassword.querySelector('.eye-switch'),
	elem_descriptionForgotPassword = modalWindow_forgotPassword.querySelector('.description'),
	but_forgotPassword = modalWindow_forgotPassword.querySelector('#but-forgot_password');

field_emailUser_FP.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionForgotPassword.innerHTML = "<p>Вкажіть Email, який Ви використовували при реєстрації.</p>";
}

field_emailUser_FP.onpaste = () => {
	return false;
}

field_passwordUser_FP.onfocus = function() {
	let elem = this.closest('.wrap-field-password');
	removeElementError(elem);
	checkSymbol(this);
	elem_descriptionForgotPassword.innerHTML = "<p>Пароль повинен містити від 8 до 24 символів, мати не менше 2 букв у верхньому регістрі та 2 цифр.</p>";
}

field_passwordUser_FP.onpaste = () => {
	return false;
}

field_repeatPassword_FP.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionForgotPassword.innerHTML = "<p>Паролі повинні збігатися.</p>";
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
	elem_descriptionForgotPassword.textContent = '';
	checkFieldsForm(form_forgotPassword);
})