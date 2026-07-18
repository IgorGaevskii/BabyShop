import {window_reviewAboutSeller, window_reviewAboutBuyer} from "./module/variables.js";
import {closeWindow, modalWindow} from "./module/open&closeWindow.js";
import collectDataForServer from "./module/collectDataForServer.js";

class WindowReview {
	constructor(pop_up) {
		this.form = pop_up.querySelector('form');
		this.allRadio = pop_up.querySelectorAll('input');
		this.allLable = pop_up.querySelectorAll('label');
		this.but_closeWindow = pop_up.querySelector('.modal-window-cross');
		this.allRatingValue = pop_up.querySelectorAll('.rating__value');
		this.but_userReview = pop_up.querySelector('.btn-user-review');
	}

	run() {
		this.allRadio.forEach(elem => {
			elem.onchange = e => {
				let target = e.target;
				let parentElem = target.closest('.simple-rating');
				let all_Label = parentElem.querySelectorAll('.point-label');
				let ratingValue = parentElem.querySelector('.rating__value');
				let array = Array.from(all_Label).reverse();
				let point = target.value;
				ratingValue.textContent = point;

				array.forEach((item, index) => {
					item.style.color = index + 1 <= point ? '#ffd300' : '#ffef9f';
				});
			};
		});

		this.but_closeWindow.onclick = () => {
			modalWindow.close;
			this.clearForm();
		};

		this.but_userReview.onclick = event => {
			event.preventDefault();
			collectDataForServer(this.form);
		};
	}

	clearForm() {
		this.allLable.forEach(item => (item.style.color = ''));
		this.allRatingValue.forEach(item => (item.textContent = '0'));
		this.form.reset();
	}
}

// --- создаем переменные заранее ---
let reviewBuyer = null;
let reviewSeller = null;

// --- потом присваиваем в зависимости от DOM ---
if (window_reviewAboutSeller && window_reviewAboutBuyer) {
	reviewBuyer = new WindowReview(window_reviewAboutSeller);
	reviewBuyer.run();
	reviewSeller = new WindowReview(window_reviewAboutBuyer);
	reviewSeller.run();
}

// --- экспортируем в конце ---
export { reviewBuyer, reviewSeller };