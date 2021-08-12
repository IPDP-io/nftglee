import { go } from '$lib/utils';
import { address, received, ws } from '$lib/stores';
import { get } from 'svelte/store';
import * as animateScroll from 'svelte-scrollto';

let timeout = 50;
let socket = () => {
	let s = new WebSocket(import.meta.env.VITE_SOCKET);
	let heartbeat;

	s.onopen = () => {
    timeout = 50;
		s.readyState === 1 &&
			get(address) &&
			s.send(JSON.stringify({ type: 'subscribe', value: get(address) }));

		heartbeat = setInterval(() => {
			s.send(JSON.stringify({ type: 'heartbeat' }));
		}, 5000);
	};

	s.onmessage = ({ data }) => {
		try {
			let { type, value } = JSON.parse(data);

			if (type === 'payment') {
        window.localStorage.setItem('pending', !value.confirmed);
				received.set(value.value);
				go('/received');
				animateScroll.scrollTo({ element: '#logo' });
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
		clearInterval(heartbeat);
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
