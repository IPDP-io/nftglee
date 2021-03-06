import { tick } from 'svelte';
import { error } from '$lib/stores';
import { goto } from '$app/navigation';

const SATS = 100000000;

export const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

export const btc = (n) => (n / SATS).toFixed(8);

export const copy = (v) => {
	let textArea = document.createElement('textarea');
	textArea.style.position = 'fixed';
	textArea.value = v;

	document.body.appendChild(textArea);

	textArea.focus();
	textArea.select();

	document.execCommand('copy');
	document.body.removeChild(textArea);
};

export const err = (e) => {
	if (!e) return error.set(e);
	if (typeof e === 'string') e = { message: e };
	let msg = e.message;
	try {
		msg = JSON.parse(msg).message;
	} catch {}
	try {
		msg = JSON.parse(msg).message;
	} catch {}
	if (!msg) msg = 'An error occurred';
	error.set(msg);
	if (e.stack) console.log(e.stack);
};

export const focus = (el) => setTimeout(() => el.focus(), 50);

export const go = (r, options = { noscroll: true }) => goto(r, options);

export function fade(id) {
	var fadeTarget = document.getElementById(id);
  if (!fadeTarget) return;

	var fadeEffect = setInterval(function () {
		if (!fadeTarget.style.opacity) {
			fadeTarget.style.opacity = 1;
		}
		if (fadeTarget.style.opacity > 0) {
			fadeTarget.style.opacity -= 0.1;
		} else {
			clearInterval(fadeEffect);
		}
	}, 30);
}

export function ios() {
		return (
			['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	}

