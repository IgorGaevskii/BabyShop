import {popupModal, message, but_popup} from "./variables.js";
import deleteChildNodes from "./deleteChildNodes.js";
import {modalWindow} from "./open&closeWindow.js";

export default function showModalWindow(text, elem) {
	message.innerHTML = text;
	modalWindow.open = popupModal;

	but_popup.onclick = () => {
		modalWindow.close;
		deleteChildNodes(message);

		if (elem && elem.tagName == 'INPUT') elem.focus();
	}
}