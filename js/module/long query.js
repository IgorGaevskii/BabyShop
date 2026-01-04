import collectDataForServer from "./collectDataForServer.js";

export let interval = null;

export function stopSetInterval() {
	clearInterval(interval);
	interval = null;
};

export function startSetInterval(obj) {
	// console.log(`data sent`);
	// console.log(obj);
	interval = setInterval( () => {
		collectDataForServer(obj);
		// console.log(interval)
	}, 5000);
};