import { goto } from '$app/navigation';
import { pending, received } from '$lib/stores';
import { get } from "svelte/store";

export default (address) => {
	let ws = new WebSocket(`ws://localhost:9090/ws`);

	ws.onmessage = ({ data }) => {
		try {
			let { type, value } = JSON.parse(data);

			if (type === 'pending') {
				pending.set(get(pending) + value);
        goto('/confirming', { noscroll: true });
			}

			if (type === 'payment') {
        received.set(get(received) + value);

				// mint();
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
