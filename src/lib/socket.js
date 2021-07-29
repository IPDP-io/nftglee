import { go } from '$lib/utils';
import { pending, received } from '$lib/stores';
import { get } from 'svelte/store';

let timeout;
let connect = () => {
	let ws = new WebSocket(`ws://localhost:9090/ws`);

	ws.onmessage = ({ data }) => {
		try {
			let { type, value } = JSON.parse(data);

			if (type === 'payment') {
				received.set(value);
				go('/received');
			}

			if (type === 'asset') {
				asset = value;
			}

			if (type === 'txid') {
				received.set(false);
				txid = value;
			}
		} catch (e) {
			console.log(e);
		}
	};

	ws.onclose = (e) => {
		timeout = 50;
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(connect, Math.min(10000, (timeout += timeout)));
	};

	return ws;
};

export default connect;
