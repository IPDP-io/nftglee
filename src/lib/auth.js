import decode from 'jwt-decode';
import { tick } from 'svelte';
import { api, auth } from '$lib/api';
import { session } from '$app/stores';
import { err, go } from '$lib/utils';
import { get } from 'svelte/store';
import { initialized, token } from '$lib/stores';
import { p2wpkh } from '$lib/wallet';

export const expired = (t) => !t || decode(t).exp * 1000 < Date.now();

export const getToken = async () => {
	try {
		let result = await auth.url('/token/refresh').get().json();
		let { jwt_token } = result;
		token.set(jwt_token);
		await tick();
		return jwt_token;
	} catch (e) {
		console.log(e);
		return e;
	}
};

export const requireLogin = () => {
	return new Promise((resolve) => {
		initialized.subscribe(async (v) => {
			if (!v) return;
			await tick();

			let $token = get(token);

			if (expired($token)) {
				try {
					$token = await getToken();
					if (!$token) throw new Error('invalid token');
					resolve($token);
				} catch (e) {
					console.log(e);
					go('/login');
				}
			}

			resolve($token);
		});
	});
};

export const activate = async (code, email, password) => {
	try {
		err(undefined);
		await api.url('/activate').post({ code, email }).unauthorized(err).badRequest(err).json();
		await login(email, password);
	} catch (e) {
		err(e.message);
	}
};

export const login = async (email, password) => {
	try {
		err(undefined);
		let user = await api
			.url('/login')
			.post({
				email,
				password
			})
			.unauthorized(err)
			.badRequest(err)
			.json();

		if (!user) return err('Login failed');
		user.token = user.jwt_token;
		session.set({ user });
		token.set(user.token);
		go('/watch');

		return user;
	} catch (e) {
		console.log(e, e.stack);
		err(e.message);
	}
};

export const logout = async () => {
	try {
		await auth.url('/logout').post().res();
		session.set('user', undefined);
    window.localStorage.removeItem('address');
		window.localStorage.removeItem('user');
		go('/');
		window.location.reload();
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
		} = p2wpkh({ mnemonic });
		pubkey = pubkey.toString('hex');
    console.log(pubkey, p2wpkh({ mnemonic }));

		let { jwt_token } = await api
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

		return true;
	} catch (e) {
		console.log(e.stack);
		err(e.message);
		return false;
	}
};
