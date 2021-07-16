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
			<div>
				<label for="first_name">Email</label>
				<input bind:value={email} bind:this={emailInput} autocapitalize="off" />
			</div>
		</div>
		<div class="form-field">
			<div>
				<label for="last_name">Password</label>
				<div id="password">
					{#if show}
						<input bind:value={password} autocapitalize="off" />
					{:else}
						<input type="password" bind:value={password} autocapitalize="off" />
					{/if}
					<span id="show-password"
						on:click|preventDefault|stopPropagation={() => (show = !show)}
					>
						<Eye />
					</span>
				</div>
			</div>
		</div>
		<div id="form-submit-controls" class="container">
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
	}
	form {
		width: 75%;
		font-family: Helvetica;
	}
	#form-submit-controls {
		text-align: center;
	}
	#password {
		position: relative;
	}
	.form-field {
		margin: 10px 0;
	}
	input {
		height: 2rem;
		height: 5vh;
	}
	textarea {
		height: 4rem;
		height: 15vh;
		resize : vertical;
	}
	input, textarea {
		background-color: transparent;
		border: 0;
		border-bottom: 1px solid var(--main-blue);
		width: 100%;
		padding: 0;
		font-size: 12px;
		font-size: 2vh;
		color: var(--main-blue);
	}
	input::placeholder, textarea::placeholder {
		color: var(--main-blue);
	}
	input:hover, textarea:hover {
		border: 1px solid var(--main-blue);
	}
	button#submit {
		height: 2.5rem;
		height: 8vh;
		width: 100%;
		padding: 0;
		font-size: 14px;
		font-size: 3vh;
		border: 0;
		transition: .6s;
	}
	button#submit:hover {
		background-color: #ffffffaa;
		color: var(--main-blue);
		transition: .4s;
		
	}
	@media screen and (max-width: 1025px) {
		button#submit {
			height:7vh;
		}
	}
	@media screen and (max-width: 769px) {
		button#submit {
			height:6vh;
			font-size: 2rem;
			font-size: 3vh;
		}
	}
	@media screen and (max-width: 481px) {
		button#submit {
			height:5vh;
			font-size: 3vh;
		}
	}
	@media (orientation: landscape) {
		input, textarea {
			font-size: 2vw;
		}
		button#submit {
			font-size: 2vw;
		}
	}
</style>
