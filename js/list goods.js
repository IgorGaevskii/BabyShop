import {createCardGoods} from "./user advert.js";
import {createCardTradingUser} from "./user trading.js";
import {createCardGhat} from "./user chat.js";
import {changeAdvert} from "./new advert.js";

//dynamically load html markup of registration forms
document.addEventListener('DOMContentLoaded', () => {
    createCardGoods();
    createCardTradingUser();
    createCardGhat()
    changeAdvert.insertListCategories();
});

function attachCardClickHandler(card) {
    card.addEventListener('click', function() {
        let codeNumber = this.querySelector('.code-number').textContent;
        document.location.href = `../pages/card goods.php?article=${codeNumber}`;
    });
}

const elem_listCard = document.querySelector('.list-card');

// Create a mutation observer to watch for new cards
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
                // Check if the added node is a card
                if (node.classList && node.classList.contains('card')) {
                    attachCardClickHandler(node);
                }
            });
        }
    });
});

// Start observing the list-card element for changes
observer.observe(elem_listCard, { 
    childList: true,  // Watch for changes to child elements
    subtree: true     // Watch the entire subtree
});

// Attach handlers to any existing cards
const allCard = elem_listCard.querySelectorAll('.card');
allCard.forEach(card => attachCardClickHandler(card));