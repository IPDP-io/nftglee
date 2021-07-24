import { api } from '$lib/api';
import { error } from '$lib/stores';
import { session } from '$app/stores';

export const activate = async () => {
	try {
		err(undefined);
		let { jwt_token: token } = await api.url('/activate').post({ code })
			.unauthorized(err)
			.badRequest(err)
			.json();
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
const err = (msg) => error.set(msg);
