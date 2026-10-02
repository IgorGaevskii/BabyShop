import deleteChildNodes from "./deleteChildNodes.js";
import {modalWindow} from "./open&closeWindow.js";

export default function showModalWindow(text, elem) {
	let popupModal = document.querySelector('.popup'),
	message = popupModal.querySelector('.popup-message'),
	but_popup = popupModal.querySelector('button');
	
	message.innerHTML = text;
	modalWindow.open = popupModal;

	but_popup.onclick = () => {
		modalWindow.close;
		deleteChildNodes(message);

		if (elem && elem.tagName == 'INPUT') elem.focus();
	}
}