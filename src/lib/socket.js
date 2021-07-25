import { go } from '$lib/utils';
import { pending, received } from '$lib/stores';
import { get } from 'svelte/store';

export default (address) => {
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

	return ws;
};
