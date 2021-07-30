<script>
	import { auth } from '$lib/api';
	import { login } from '$lib/auth';
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import Fields from '$components/fields.svelte';
	import { go } from '$lib/utils';

	let email = 'test21@coinos.io';
	let password = 'liquidart';
	let error;
	let err = (e) => (error = e);

	let submit = async () => {
		try {
			let res = await login(email, password);
      console.log('res', res);
			if (!res) throw new Error('login failed');
			go('/watch');
		} catch (e) {
			console.log('boom', e);
		}
	};
</script>

<div class="container">
	{#if error}
		<div>{error}</div>
	{/if}

	<form on:submit|preventDefault={submit} autocomplete="off">
		<Fields bind:email bind:password />
		<div class="container form-submit-controls">
			<div class="container column">
				<button type="submit">Sign in</button>
			</div>
		</div>
	</form>
</div>

<style>
	button[type='submit']:hover {
		background-color: #ffffffaa;
		color: var(--main-blue);
	}
	form {
		width: 33%;
	}
	@media screen and (max-width: 1025px) {
		form {
			width: 50%;
		}
	}
	@media screen and (max-width: 769px) {
		form {
			width: 66%;
		}
	}
	@media screen and (max-width: 480px) {
		form {
			width: 100%;
		}
	}
</style>
