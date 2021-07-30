import { tick } from 'svelte';
import { api, auth } from '$lib/api';
import { session } from '$app/stores';
import { goto } from '$app/navigation';
import { err } from '$lib/utils';
import { get } from 'svelte/store';
import { token } from '$lib/stores';

export const expired = (t) => !t || decode(t).exp * 1000 < Date.now();

export const refreshToken = () => {
	return auth
		.url('/token/refresh')
		.get()
		.json(({ jwt_token }) => {
			token.set(jwt_token);
			window.sessionStorage.setItem('token', jwt_token);
		});
};

export const requireLogin = async (page) => {
	await tick();

	if (page && page.path === '/login') return;
	let $token = get(token);

	if (expired($token)) {
		try {
			await refreshToken();
			await tick();
		} catch (e) {}
	}

	$token = get(token);

	if (expired($token)) {
		goto('/login');
		throw new Error('Login required');
	}
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
		let { jwt_token: token } = await api
			.url('/login')
			.post({
				email,
				password
			})
			.unauthorized(err)
			.badRequest(err)
			.json();

		let user = {
			email,
			token
		};

		session.set({ user });

    console.log("returning user", user);

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
	} catch (e) {
		console.log(e);
	}
};

export const register = async (email, password, mnemonic) => {
	try {
		err(undefined);
		let { jwt_token: token } = await api
			.url('/register')
			.post({
				email,
				password,
				mnemonic
			})
			.unauthorized(err)
			.badRequest(err)
			.json();

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
