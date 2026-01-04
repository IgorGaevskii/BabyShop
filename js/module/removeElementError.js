export function removeElementError(elem) {

	if ( elem.nextElementSibling && elem.nextElementSibling.matches('.error')) {
		elem.nextElementSibling.remove();
	}
}

export function removeElementsError() {

	for ( let elem of document.querySelectorAll('.error') ) {
		elem.remove();
	}
}