<script>
	import { auth } from '$lib/api';
	import { session } from '$app/stores';
  import { mnemonic } from '$lib/stores';
  import { Fields } from "$components/fields.svelte";

	let email = 'test12@coinos.io';
	let password = 'liquidart';

	let error;
	let err = (e) => (error = e);
</script>

<div class="container">
  {#if error}
    <div>{error}</div>
  {/if}

	<form on:submit|preventDefault={login} autocomplete="off">
    <Fields />
		<div class="container form-submit-controls">
			<div class="container column">
				<button type="submit">Sign in / Register</button>
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
