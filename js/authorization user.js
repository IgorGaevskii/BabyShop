import checkSymbol from "./module/checkSymbol.js";
import checkFieldsForm from "./module/checkFieldsForm.js";
import {openWindow} from "./module/open&closeWindow.js";
import collectDataForServer from "./module/collectDataForServer.js";

const formAuthorization = document.forms.authorizationUser,
	input_emailAuthorization = formAuthorization.querySelector("input[name='email']"),
	input_passwordAuthorization = formAuthorization.querySelector("input[name='password']"),
	but_authorization = formAuthorization.querySelector("#but-authorization"),
	elem_eyeSwitch = formAuthorization.querySelector('.eye-switch');

//Checking the entered characters in the "email" field
input_emailAuthorization.onfocus = function() {
	checkSymbol(this);
}

//Checking the entered characters in the "password" field
input_passwordAuthorization.onfocus = function() {
	checkSymbol(this);
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

	if (checkFieldsForm( formAuthorization.querySelectorAll('input') ) ) {
		collectDataForServer(formAuthorization);
	}
});