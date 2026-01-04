export function closeWindow(elem) {

	if (elem.classList.contains('modal')) {
		elem.classList.remove('show');
		elem.classList.add('hide');
	} else {
		elem.classList.add('hide');
	}
}

export function openWindow(elem) {

	if (elem.classList.contains('modal' || 'ask')) {
		elem.classList.remove('hide');
		elem.classList.add('show');
	} else {
		elem.classList.remove('hide');
	}
}

export let modalWindow = {
	set open(elem) { 
		this.elem = elem;
		this.elem.classList.remove('hide');
		this.elem.classList.add('show');
	},

	get close() {
		this.elem.classList.remove('show');
		this.elem.classList.add('hide');
	}
};