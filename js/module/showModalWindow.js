import {popupModal, message, but_popup} from "./variables.js";
import deleteChildNodes from "./deleteChildNodes.js";
import {openWindow, closeWindow} from "./open&closeWindow.js";

export default function showModalWindow(text, elem) {
	message.innerHTML = text;
	openWindow(popupModal);

	but_popup.onclick = () => {
		closeWindow(popupModal)
		deleteChildNodes(message);

		if (elem && elem.tagName == 'INPUT') elem.focus();
	}
}