export default function deleteChildNodes(...arrParent) {
	arrParent.forEach(parent => {

		while (parent.firstChild) {
			parent.firstChild.remove();
		}
	})
}