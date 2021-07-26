<script>
	import { auth } from '$lib/api';
	import { session } from '$app/stores';
	import { mnemonic } from '$lib/stores';
	import Fields  from "$components/fields.svelte";

	let email = 'test12@coinos.io';
	let password = 'liquidart';
	let login;
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
	button[type=submit]:hover {
		background-color: #ffffffaa;
		color: var(--main-blue);
	}
	form {
		width: 33%;
	}
	@media screen and (max-width: 1025px) {
		form {
			width: 50%;
		}
	}
	@media screen and (max-width: 769px) {
		form {
			width: 66%;
		}
	}
	@media screen and (max-width: 480px) {
		form {
			width: 100%;
		}
	}
</style>
