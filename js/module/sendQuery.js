import parseResponseServer from "./parseResponseServer.js";

export default async function sendQuery(dataForServer, url) {
	let response = await fetch(url, {
			method: 'POST',
			body: dataForServer
		});

	if (response.ok) { //проверяем статус ответа сервера
		let answerServer = await response.json(); //получаем тело ответа (декодируем JSON-строку в массив)
		// console.log(`Answer server: ${answerServer.action}`)
		console.log(answerServer);
		parseResponseServer(answerServer);
		
	} else {
		alert(`Ошибка HTTP: ${response.status}`); //выводим ошибку
		// console.log(`Answer server: ${answerServer.action}`)
		// console.log(answerServer);
	}
}