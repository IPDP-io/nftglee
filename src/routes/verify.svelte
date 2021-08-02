<script>
	import { onMount } from 'svelte';
	import { focus, err, go } from '$lib/utils';
	import { session } from '$app/stores';

	let word;

	let verify = () => {
		if (word === $session.user.mnemonic.split(' ')[6]) go('/register');
		else err('Nope');
	};

	let back = () => go('/received');
</script>

<div class="container column">
	<div class="container">
		<h2 class="container">What was word #7?</h2>
	</div>
</div>

<div class="container">
	<form on:submit|preventDefault={verify} class="small-form white-form">
		<div class="form-field">
			<div class="container">
				<input id="word" bind:value={word} autocapitalize="off" use:focus />
			</div>
		</div>

		<div class="container submit-controls mb">
			<button type="button" on:click={back}>Back</button>
			<button>Verify</button>
		</div>
	</form>
</div>

<style>
	#word {
		width: 10em;
	}
	.submit-controls {
		justify-content: space-between;
	}
	@media screen and (max-width: 769px) {
		.submit-controls {
			justify-content: space-evenly;
		}
	}
</style>
