import { api } from '$lib/api';
import { session } from '$app/stores';
import { goto } from '$app/navigation';
import { err } from "$lib/utils";

export const activate = async (code, email) => {
	try {
		err(undefined);
		await api
			.url('/activate')
			.post({ code, email })
			.unauthorized(err)
			.badRequest(err)
			.json();

    goto('/goodies', { noscroll: true });
	} catch (e) {
		err(e.message);
	}
};

export const login = async () => {
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

		session.set({
			user: {
				email,
				token
			}
		});
	} catch (e) {
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
