export default function Tab(elem) {
	this.tadHeading = elem.querySelector('.tabs');
	this.allTabItem = elem.querySelectorAll('.tabs-item');
	this.allContentTab = elem.querySelectorAll('.content_tab');

	this.toggelContent = (event) => {

		if (event.target.className == 'tabs-item') {

			for (let tab_item of this.allTabItem) {
				tab_item.classList.remove('active');
			}

			event.target.classList.add('active');
			event.target.style.color = '';

			for (let i = 0; i < this.allContentTab.length; i++) {

				if (event.target.dataset.item == i) {
					this.allContentTab[i].classList.remove('hide');
				} else {
					this.allContentTab[i].classList.add('hide');
				}
			}
		}
	};

	this.changeColorText = () => {
		
		if (!event.target.classList.contains('active') && event.target.className == 'tabs-item') {
			event.target.style.color = '#fc7b00';
		}
	};

	this.cancelColorText = () => {
		
		if (!event.target.classList.contains('active')) {
			event.target.style.color = '';
		}
	}

	this.assignHandler = () => {
		this.tadHeading.addEventListener('click', this.toggelContent);
		this.tadHeading.addEventListener('mouseover', this.changeColorText);
		this.tadHeading.addEventListener('mouseout', this.cancelColorText);
	};
}