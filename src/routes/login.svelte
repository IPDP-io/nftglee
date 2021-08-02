<script>
	import { auth } from '$lib/api';
	import { login } from '$lib/auth';
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import Fields from '$components/fields.svelte';
	import { go } from '$lib/utils';

	let email;
	let password;
	let error;
	let err = (e) => (error = e);

	let submit = async () => {
		try {
			let res = await login(email, password);
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

	<form on:submit|preventDefault={submit} class="small-form white-form" autocomplete="off">
		<Fields bind:email bind:password />
		<div class="container form-submit-controls">
			<div class="container column">
				<button type="submit">Sign in</button>
				<div class="mb">
					<a href="/register" style="text-decoration: underline">Register an account</a>
				</div>
			</div>
		</div>
	</form>
</div>
