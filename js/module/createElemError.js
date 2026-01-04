export default function createElemError(field, textError) {
	let divError = document.createElement('div');
	divError.innerHTML = textError;
	divError.className = 'error';

	if (field.name == 'password_user' || field.name == 'consent') {
		let elem = field.parentElement;
		elem.after(divError);
	} else {
		field.after(divError);
	}
}