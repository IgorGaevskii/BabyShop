import checkSymbol from "./module/checkSymbol.js";
import checkFieldsForm from "./module/checkFieldsForm.js";
import {openWindow} from "./module/open&closeWindow.js";
import {formAuthorization, input_emailAuthorization, input_passwordAuthorization, but_authorization} from "./module/variables.js";

const modalWindow_forgotPassword  = document.getElementById('forgot_password'),
	modalWindow_registrationMoveOne = document.getElementById('registration_move_one'),
	elem_eyeSwitch = formAuthorization.querySelector('.eye-switch');

//Checking the entered characters in the "email" field
input_emailAuthorization.onfocus = function() {
	// removeElementError(this);
	checkSymbol(this);
}

//Checking the entered characters in the "password" field
input_passwordAuthorization.onfocus = function() {
	// removeElementError(this);
	checkSymbol(this);
	// description.innerHTML = "<p>Пароль должен содержать от 8 до 24 символа, иметь не мение 2 букв вверхнем регистре и 2 цифр.</p>";
}

elem_eyeSwitch.onclick = function() {
	let elem_img = this.firstElementChild;
	let elem_inputPassword = this.previousElementSibling;

	if (elem_inputPassword.type == 'password') {
		elem_inputPassword.type = 'text';
		elem_img.src = '../pictures/hide password.png';
	} else {
		elem_inputPassword.type = 'password';
		elem_img.src = '../pictures/show password.png';
	}
}

but_authorization.addEventListener('click', (e) => {
	e.preventDefault();
	checkFieldsForm(formAuthorization);
});