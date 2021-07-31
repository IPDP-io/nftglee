import decode from 'jwt-decode';
import { tick } from 'svelte';
import { api, auth } from '$lib/api';
import { session } from '$app/stores';
import { goto } from '$app/navigation';
import { err } from '$lib/utils';
import { get } from 'svelte/store';
import { initialized, token } from '$lib/stores';
import { p2wpkh } from '$lib/wallet';

export const expired = (t) => !t || decode(t).exp * 1000 < Date.now();

export const getToken = async () => {
	let refresh_token = window.localStorage.getItem('refresh');
	if (!refresh_token) return;
	let result = await auth.url('/token/refresh').query({ refresh_token }).get().json();
	let jwt_token;
	({ jwt_token, refresh_token } = result);
	window.localStorage.setItem('refresh', refresh_token);
	token.set(jwt_token);
	return jwt_token;
};

export const requireLogin = () => {
	initialized.subscribe(async (v) => {
		if (!v) return;
		await tick();

		let $token = get(token);

		if (expired($token)) {
			try {
				$token = await getToken();
				if (!$token) throw new Error();
			} catch (e) {
				console.log(e);
				goto('/login');
			}
		}
	});
};

export const activate = async (code, email) => {
	try {
		err(undefined);

		await api.url('/activate').post({ code, email }).unauthorized(err).badRequest(err).json();

		goto('/watch', { noscroll: true });
	} catch (e) {
		err(e.message);
	}
};

export const login = async (email, password) => {
	try {
		err(undefined);
		let { jwt_token: token, refresh_token } = await api
			.url('/login')
			.post({
				email,
				password
			})
			.unauthorized(err)
			.badRequest(err)
			.json();

		window.localStorage.setItem('refresh', refresh_token);

		let user = {
			email,
			token
		};

		session.set({ user });

		return user;
	} catch (e) {
		console.log(e, e.stack);
		err(e.message);
	}
};

export const logout = async (refresh_token) => {
	try {
		await auth.url('/logout').query({ refresh_token }).post().res();
		session.set('user', undefined);
		window.localStorage.removeItem('refresh');
		goto('/');
	} catch (e) {
		console.log(e);
	}
};

export const register = async (email, password, mnemonic) => {
	try {
		err(undefined);

		let {
			address,
			redeem: { pubkey }
		} = p2wpkh();
		pubkey = pubkey.toString('hex');

		let { jwt_token: token, refresh_token } = await api
			.url('/register')
			.post({
				email,
				password,
				mnemonic,
				pubkey,
				address
			})
			.unauthorized(err)
			.badRequest(err)
			.json();

		window.localStorage.setItem('refresh', refresh_token);

		session.set({
			user: {
				email,
				token
			}
		});
	} catch (e) {
		console.log(e.stack);
		err(e.message);
	}
};
