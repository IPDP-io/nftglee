<script>
	import PendingIcon from '$icons/pending.svelte';
	import { session } from '$app/stores';
	import { activate, register } from '$lib/auth';
	import Fields from '$components/fields.svelte';
	import { focus } from '$lib/utils';

	let email, password, code, loading, registered;

	let submit = async () => {
		loading = true;
		registered = await register(email, password, $session.user.mnemonic);
    window.localStorage.removeItem(window.localStorage.getItem('address'));
    window.localStorage.removeItem('address');
		loading = false;
	};

	$: if (code && code.length >= 6) activate(code, email, password);
</script>

{#if registered}
	<h2 class="container mb">Registered!</h2>
	<div class="container mb">Check your email for an activation code</div>
	<div class="container">
		<form
			on:submit|preventDefault={() => activate(code, email, password)}
			class="small-form white-form"
		>
			<div class="form-field">
				<div class="container" style="max-width: 200px; margin: 0 auto">
					<input id="code" bind:value={code} autocapitalize="off" class="grow" use:focus />
				</div>
			</div>
			<div class="container">
				<button>Submit</button>
			</div>
		</form>
	</div>
{:else if loading}
	<div id="loading" class="container column">
		<div class="container">
			<h3>Loading</h3>
		</div>
		<div class="container">
			<PendingIcon size="medium" />
		</div>
	</div>
{:else}
	<h2 class="container">Register an account</h2>
	<div class="container">
		<form on:submit|preventDefault={submit} autocomplete="off" class="small-form white-form">
			<Fields bind:email bind:password />
			<div class="container form-submit-controls">
				<div class="container column">
					<button type="submit">Register</button>
				</div>
			</div>
		</form>
	</div>
{/if}
