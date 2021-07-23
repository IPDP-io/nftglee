<script>
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import { register } from '$lib/auth';
	import Fields from '$components/fields.svelte';

	let email = 'test12@coinos.io';
	let password = 'liquidart';
</script>

<div class="container">
	<form on:submit|preventDefault={() => register(email, password, $mnemonic)} autocomplete="off">
		<Fields bind:email bind:password />
		<div class="container form-submit-controls">
			<div class="container column">
				<button type="submit">Register</button>
			</div>
		</div>
	</form>
</div>
