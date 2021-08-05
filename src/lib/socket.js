import { go } from '$lib/utils';
import { pending, received, ws } from '$lib/stores';
import { get } from 'svelte/store';

let timeout = 50;
let socket = () => {
	let s = new WebSocket(import.meta.env.VITE_SOCKET);

  s.onopen = () => get(address) && s.send(JSON.stringify({ type: 'subscribe', value: get(address) }))
  

	s.onmessage = ({ data }) => {
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

	s.onclose = (e) => {
		timeout = Math.min(10000, (timeout += timeout));
		console.log('socket reconnect in', timeout);
		setTimeout(socket, timeout);
	};

	ws.set(s);
};

export let send = (type, value) => {
	let s = get(ws);

	if (s.readyState !== 1) {
		socket();
		return setTimeout(() => send(type, value), 500);
	}

	s.send(JSON.stringify({ type, value }));
};

export default socket;
