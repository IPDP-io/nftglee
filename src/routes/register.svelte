<script>
	import PendingIcon from '$icons/pending.svelte';
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import { activate, register } from '$lib/auth';
	import Fields from '$components/fields.svelte';
	import { focus } from '$lib/utils';

	let email;
	let password = 'liquidart';
	let code;
	let loading;

	let submit = async () => {
		loading = true;
		await register(email, password, $mnemonic);
		loading = false;
	};

  $: if (code && code.length >= 6) activate(code, $session.user.email)
</script>

{#if $session.user}
	<h2 class="container">Registered!</h2>
	<div class="container mb">Check your email for an activation code</div>
	<form on:submit|preventDefault={() => activate(code, $session.user.email)}>
		<div class="form-field">
			<div class="container" style="max-width: 200px; margin: 0 auto">
				<input id="code" bind:value={code} autocapitalize="off" class="grow" use:focus />
			</div>
		</div>
		<div class="container">
			<button>Submit</button>
		</div>
	</form>
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
	<h2 class="container">Almost there</h2>
	<p class="container">We just need an email and password</p>
	<div class="container">
		<form on:submit|preventDefault={submit} autocomplete="off">
			<Fields bind:email bind:password />
			<div class="container form-submit-controls">
				<div class="container column">
					<button type="submit">Register</button>
				</div>
			</div>
		</form>
	</div>
{/if}
