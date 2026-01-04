"use strict"

// Run menu: show/hide subitems and handle subitem clicks
const menuCategory = document.getElementById('menu-category');

// Helper to load goods via AJAX and (optionally) push history state
function loadGoods(idCat, idSub, pushState = true) {
	if (!idSub) return;
	fetch('/php/selectGoods.php?id_subcategory=' + encodeURIComponent(idSub) + '&id_category=' + encodeURIComponent(idCat))
		.then(response => response.json())
		.then(data => {
			if (!data || data.error !== 'success') {
				console.error('Failed to load goods', data);
				return;
			}

			const container = document.querySelector('.content.list-card');
			if (!container) return;

			container.innerHTML = '';
			data.goods.forEach(g => {
				const card = document.createElement('div');
				card.className = 'card';
				card.innerHTML = `<img src="${g.src}" width="230" height="230">
					<p class="card__name">${g.title}</p>
					<p class="card__code">Код товара: <span class="code-number">${g.article}</span></p>
					<p class="card__price">Цена: ${g.price} гр</p>`;
				container.appendChild(card);
			});

			// Push history state so back/forward can restore this selection
			try {
				if (pushState) {
					const url = `/pages/list goods.php?id_category=${encodeURIComponent(idCat || '')}&id_subcategory=${encodeURIComponent(idSub)}`;
					history.pushState({ id_category: idCat, id_subcategory: idSub }, '', url);
				}
			} catch (err) {
				// ignore history exceptions (e.g., security restrictions)
				console.warn('History pushState failed', err);
			}
		})
		.catch(err => console.error('Error fetching goods:', err));
}

// If menu is not present, nothing to do
if (menuCategory) {
	menuCategory.addEventListener('click', function(event) {
		const target = event.target;
		// Handle clicks on subitem links.
		const sub = target.closest('.subitem-link');
		if (!sub) return;

		const pathname = window.location.pathname;
		const onListPage = pathname.indexOf('list%20goods.php') !== -1 || pathname.indexOf('list goods.php') !== -1;
		const onIndexPage = pathname.indexOf('index.php') !== -1 || pathname === '/' || pathname === '';

		const idCat = sub.dataset.idCategory;
		const idSub = sub.dataset.idSubcategory;

		// debugger;

		// If we are on the list goods page, intercept and fetch content via AJAX
		if (onListPage) {
			event.preventDefault();
			loadGoods(idCat, idSub, true);

		// If we are on the index page, send a POST request to navigate
		} else if (onIndexPage) {
			event.preventDefault();
			// Create and submit a form with POST
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '/pages/list goods.php';
			form.style.display = 'none';

			const inputCat = document.createElement('input');
			inputCat.type = 'hidden';
			inputCat.name = 'id_category';
			inputCat.value = idCat || '';
			form.appendChild(inputCat);

			const inputSub = document.createElement('input');
			inputSub.type = 'hidden';
			inputSub.name = 'id_subcategory';
			inputSub.value = idSub;
			form.appendChild(inputSub);

			document.body.appendChild(form);
			form.submit();
		}
		// Fallback: if we're on any other page (for example card goods page)
		// there are no anchor links for subitems, so default navigation does nothing.
		// Submit a hidden POST form to `pages/list goods.php` (keeps behavior consistent
		// with index page navigation which uses POST -> PRG redirect on the server).
		else if (idCat && idSub) {
			event.preventDefault();
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '/pages/list goods.php';
			form.style.display = 'none';

			const inputCat2 = document.createElement('input');
			inputCat2.type = 'hidden';
			inputCat2.name = 'id_category';
			inputCat2.value = idCat || '';
			form.appendChild(inputCat2);

			const inputSub2 = document.createElement('input');
			inputSub2.type = 'hidden';
			inputSub2.name = 'id_subcategory';
			inputSub2.value = idSub;
			form.appendChild(inputSub2);

			document.body.appendChild(form);
			form.submit();
		}
	});

	// Handle back/forward navigation: restore goods via AJAX when on list page
	window.addEventListener('popstate', (event) => {
		const pathname = window.location.pathname;
		const onListPage = pathname.indexOf('list%20goods.php') !== -1 || pathname.indexOf('list goods.php') !== -1;
		if (!onListPage) return;

		// Try to use state, fall back to URL params
		const state = event.state || {};
		let idCat = state.id_category;
		let idSub = state.id_subcategory;

		if (!idSub) {
			try {
				const params = new URLSearchParams(window.location.search);
				idCat = idCat || params.get('id_category');
				idSub = idSub || params.get('id_subcategory');
			} catch (err) {
				// ignore
			}
		}

		if (idSub) {
			// don't push another history entry when restoring
			loadGoods(idCat, idSub, false);
		} else {
			// No selection stored — reload the page to let server render default content
			// Use location.replace to avoid creating extra history entries
			location.replace('/pages/list goods.php');
		}
	});
}