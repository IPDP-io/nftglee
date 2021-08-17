<script>
	import PendingIcon from '$icons/pending.svelte';
	import { session } from '$app/stores';
	import { err, focus } from '$lib/utils';
	import { auth } from '$lib/api';
	import Password from '$components/password.svelte';
	import { login } from '$lib/auth';

	let email, loading, sent, ticket, password;

	let submit = async () => {
		loading = true;

		try {
			await auth.url('/change-password/request').post({ email });
		} catch (e) {
			err(e.message);
		}

		sent = true;
		loading = false;
	};

	let reset = async () => {
		try {
      ticket = ticket.trim();

			let res = await auth
				.url('/change-password/change')
				.post({ ticket, new_password: password })
				.res();

			await login(email, password);
		} catch (e) {
			err(e.message);
		}
	};
</script>

{#if sent}
	<h2 class="container mb">Reset request received!</h2>
	<p class="container">Enter the code you received in your email</p>
	<div class="container">
		<form on:submit|preventDefault={reset} autocomplete="off" class="small-form white-form">
			<div class="form-field">
				<input
					id="code"
					bind:value={ticket}
					autocapitalize="off"
					class="grow"
					use:focus
					placeholder="Code"
				/>
			</div>
			<Password bind:password placeholder="New password" />
			<div class="container form-submit-controls">
				<div class="container column">
					<button type="submit">Submit</button>
				</div>
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
	<h2 class="container">Password Reset</h2>
	<div class="container">
		<form on:submit|preventDefault={submit} autocomplete="off" class="small-form white-form">
			<div class="form-field">
				<div class="container">
					<input
						bind:value={email}
						placeholder="Email"
						autocapitalize="off"
						class="grow"
						use:focus
					/>
				</div>
			</div>
			<div class="container form-submit-controls">
				<div class="container column">
					<button type="submit">Submit</button>
				</div>
			</div>
		</form>
	</div>
{/if}
