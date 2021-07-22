<script>
	import Eye from '../icons/eye.svelte';
	import { auth } from '$lib/api';
	import { session } from '$app/stores';

	let email = 'test12@coinos.io';
	let password = 'liquidart';
	let emailInput, show;

	let error;
	let err = (e) => (error = e);

	const login = async () => {
		try {
		error = false;
			let { jwt_token: token } = await auth 
				.url('/login')
				.post({
					email,
					password,
				})
				.unauthorized(err)
				.badRequest(err)
				.json();

			$session.user = {
				email,
				token
			};
		} catch (e) {
			err(e.message);
		}
	};
</script>

<div class="container">
  {#if error}
    <div>{error}</div>
  {/if}

	<form on:submit|preventDefault={login} autocomplete="off">
		<div class="form-field">
			<div class="container">
				<label for="first_name">Email: </label>
				<input bind:value={email} bind:this={emailInput} autocapitalize="off" class="grow" />
			</div>
		</div>
		<div class="form-field">
			<div>
				<div id="password" class="container">
					{#if show}
						<label for="last_name">Password: </label>
						<input bind:value={password} autocapitalize="off" class="grow" />
					{:else}
						<label for="last_name">Password: </label>
						<input type="password" bind:value={password} autocapitalize="off" class="grow" />
					{/if}
					<span id="show-password"
						on:click|preventDefault|stopPropagation={() => (show = !show)}
					>
						<Eye />
					</span>
				</div>
			</div>
		</div>
		<div class="container form-submit-controls">
			<div class="container column">
				<button type="submit">Sign in / Register</button>
				<a href="/forgot-password">Forgot password?</a>
				<!-- <a href="/register">Don't have an account? Sign up</a> -->
			</div>
		</div>
		
	</form>
</div>

<style>
	#show-password {
		width: 2rem;
		position: absolute;
		right: 0px;
	}
	#password {
		position: relative;
	}
	input, label {
		border-bottom: 1px solid var(--main-blue);
		color: var(--main-blue);
	}
	label {
		width: 6em;
	}
	input {
		width: fit-content;
	}
	input::placeholder {
		color: var(--main-blue);
	}
	input:hover {
		border: 1px solid var(--main-blue);
	}
	button[type=submit]:hover {
		background-color: #ffffffaa;
		color: var(--main-blue);
	}
</style>
