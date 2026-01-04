import getAllInput from "./get all input.js";

export default function manageCheckboxes() {
	let inputs = getAllInput(this.closest('.content_tab'));

	if (!inputs.length) {
		this.checked = false;
		return;
	}

	function changeInput(b) {

		for (let i = 0; i < inputs.length; i++) {

			if (inputs[i].checked === b) continue;

			inputs[i].checked = b;
		}
	}
	
	this.checked? changeInput(true): changeInput(false);
}