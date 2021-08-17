<script>
	import { auth } from '$lib/api';
	import { login } from '$lib/auth';
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import Fields from '$components/fields.svelte';

	let email;
	let password;
	let error;
	let err = (e) => (error = e);

	let submit = async () => {
		try {
			let res = await login(email, password);
			if (!res) throw new Error('login failed');
		} catch (e) {
			console.log('boom', e);
		}
	};
</script>

<div class="container">
	{#if error}
		<div>{error}</div>
	{/if}

	<form on:submit|preventDefault={submit} class="small-form white-form" autocomplete="off">
		<Fields bind:email bind:password />
		<div class="container mb">
			<button type="submit">Sign in</button>
		</div>

    <div class="container mb">Or..</div>

		<div class="container form-submit-controls">
			<a href="/register"><button class="mb">Register</button></a>
			<a href="/forgot"><button class="mb">Forgot Password</button></a>
		</div>
	</form>
</div>
