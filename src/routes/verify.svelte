<script>
	import { onMount } from 'svelte';
	import { mnemonic } from '$lib/stores';
	import { focus, err, go } from '$lib/utils';

	let word;

	let verify = () => {
    console.log($mnemonic);
		if (word === $mnemonic.split(' ')[6]) go('/register');
		else err('Nope');
	};

	let back = () => go('/received');
</script>

<h2 class="container">What was word #7?</h2>

<form on:submit|preventDefault={verify}>
	<div class="form-field">
		<div class="container" style="max-width: 200px; margin: 0 auto">
			<input id="word" bind:value={word} autofocus autocapitalize="off" class="grow" use:focus />
		</div>
	</div>

	<div class="container mb">
		<button type="button" on:click={back}>Back</button>
		<button>Verify</button>
	</div>
</form>
