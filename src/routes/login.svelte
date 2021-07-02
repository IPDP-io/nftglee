<script>
	import Eye from '../icons/eye.svelte';
  import { api } from "$lib/api";
  import { goto } from "$app/navigation";
  import { token } from "$lib/store";

  let email = 'test12@coinos.io';
  let password = 'liquidart';
  let emailInput, show;

  let err = console.log;
	const login = (email, password) => {
		api
			.url('/login')
			.post({
				email,
				password
			})
			.unauthorized(err)
			.badRequest(err)
			.json(({ jwt_token: t }) => {
				window.sessionStorage.setItem('token', t);
        $token = t;
        console.log("OK!", t);
        goto("/view");
			})
			.catch(() => {
				err('Login failed');
			});
	};
</script>

<div class="form-container bg-lightblue px-4">
	<form class="mb-6" on:submit|preventDefault={() => login(email, password)} autocomplete="off">
		<h2 class="text-xl mb-8">Sign in</h2>
		<div class="flex flex-col mb-4">
			<label class="mb-2 font-medium text-gray-600" for="first_name">Email</label>
			<input bind:value={email} bind:this={emailInput} autocapitalize="off" />
		</div>
		<div class="flex flex-col mb-4">
			<label class="mb-2 font-medium text-gray-600" for="last_name">Password</label>
			<div class="relative">
				{#if show}
					<input class="w-full" bind:value={password} autocapitalize="off" />
				{:else}
					<input class="w-full" type="password" bind:value={password} autocapitalize="off" />
				{/if}
				<button
					class="absolute h-full px-3 right-0 top-0 w-auto"
					type="button"
					on:click|preventDefault|stopPropagation={() => (show = !show)}
				>
					<Eye />
				</button>
			</div>
		</div>
		<a href="/forgot-password" class="block w-full text-midblue">Forgot password?</a>
		<div class="flex my-5 justify-end">
			<button
				class="rounded-xl bg-primary text-white py-2 px-6 md:text-lg whitespace-nowrap"
				type="submit">Sign in</button
			>
		</div>
		<a href="/register" class="text-midblue">Don't have an account? Sign up</a>
	</form>
</div>

<style>
	.form-container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form-container form {
		width: 100%;
		max-width: 450px;
		background-color: white;
		padding: 40px;
		box-shadow: 0 1px 5px rgb(0 0 0 / 18%);
		border-radius: 10px;
	}

	input {
		@apply appearance-none border rounded text-gray-700 leading-tight;
		padding: 0;
		padding: 10px;
	}

	span {
		cursor: pointer;
	}

	@media only screen and (max-width: 640px) {
		.form-container {
			background: none;
			height: auto;
		}

		.form-container form {
			box-shadow: none;
			padding: 0.2rem;
			margin-top: 50px;
		}
	}
</style>
