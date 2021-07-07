<script>
	import Eye from '../icons/eye.svelte';
	import Loading from '../components/loading.svelte';
	import { api } from '$lib/api';
	import { validateEmail } from '$lib/utils';
	import { setup, createWallet } from '$lib/wallet';
	import { onMount } from 'svelte';

	onMount(setup);

	let email = 'test14@coinos.io';
	let password = 'liquidart';
	let emailInput, show, loading, registered;
	let submit = async () => {
		if (!validateEmail(email)) throw new Error('Invalid email');
		if (password.length < 8) throw new Error('Password must be 8 characters');

		await api
			.url('/register')
			.post({
				email,
				password,
				...createWallet(window.bip39.generateMnemonic(), password)
			})
			.json();

    registered = true;
	};
</script>

<svelte:head>
	<script src="/static/bip32.js"></script>
	<script src="/static/bip39.js"></script>
	<script src="/static/liquidjs.js"></script>
</svelte:head>

<div class="form-container bg-lightblue px-4">
	<form class="mb-6" on:submit|preventDefault={submit} autocomplete="off">
		{#if loading}
			<Loading />
		{:else if registered}
			<h2 class="mb-8">Registered!</h2>
			<p>Thanks for registering. Please check your email for an activation link.</p>

			<p class="mt-4">
				<a href="/login" class="secondary-color">Continue to sign in page</a>
			</p>
		{:else}
			<h2 class="mb-8 text-xl">Sign up</h2>
			<div class="flex flex-col mb-4">
				<label class="mb-2 font-medium text-gray-600" for="first_name">Email</label>
				<input
					id="email"
					name="email"
					placeholder="Email"
					bind:value={email}
					bind:this={emailInput}
				/>
			</div>
			<div class="flex flex-col mb-4">
				<label class="mb-2 font-medium text-gray-600" for="last_name">Password</label>
				<div class="relative">
					{#if show}
						<input
							class="w-full"
							bind:value={password}
							autocapitalize="off"
							id="password"
							name="password"
							placeholder="At least 8 characters."
						/>
					{:else}
						<input
							class="w-full"
							type="password"
							bind:value={password}
							autocapitalize="off"
							id="password"
							name="password"
							placeholder="At least 8 characters."
						/>
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
			<span class="block w-full"
				>By signing up, you agree to the
				<a href="/terms-and-conditions" class="text-midblue">Terms and Conditions</a>
				and
				<a href="/privacy-policy" class="text-midblue">Privacy Policy</a></span
			>
			<div class="flex my-5 justify-end">
				<button
					class="rounded-xl bg-primary text-white py-2 px-6 md:text-lg whitespace-nowrap"
					type="submit">Register</button
				>
			</div>

			<a href="/login" class="text-midblue"> Already have an account? Sign in</a>
		{/if}
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
