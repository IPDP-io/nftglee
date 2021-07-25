<script>
  import { focus } from "$lib/utils";
	import Eye from '../icons/eye.svelte';
	export let email, password;
	let show;
</script>

<div class="form-field">
	<div class="container">
		<label for="first_name">Email: </label>
		<input bind:value={email} autocapitalize="off" class="grow" autofocus use:focus />
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
			<div id="show-password" on:click|preventDefault|stopPropagation={() => (show = !show)} style="height: 100%">
				<Eye size={60} />
			</div>
		</div>
	</div>
</div>

<style>
	#show-password {
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
