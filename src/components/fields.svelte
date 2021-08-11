<script>
	import { focus } from '$lib/utils';
	import { onMount } from 'svelte';
	import Eye from '../icons/eye.svelte';
	export let email, password;
	let show;

	onMount(async () => {
		const loginFields = document.getElementById('login-fields');
		const formFields = loginFields.querySelectorAll('.form-field');
		const getParentFormField = (element) => element.closest('.form-field');
		for (let formField of formFields) {
			formField.addEventListener('focusin', (e) => {
				getParentFormField(e.target).classList.add('focused');
			});
			formField.addEventListener('focusout', (e) => {
				getParentFormField(e.target).classList.remove('focused');
			});
		}
	});
</script>

<div id="login-fields">
	<div class="form-field">
		<div class="container">
			<input
				id="first_name"
				bind:value={email}
				placeholder="Email"
				autocapitalize="off"
				class="grow"
				use:focus
			/>
		</div>
	</div>
	<div class="form-field">
		<div>
			<div id="password" class="container">
				{#if show}
					<input
						id="password-input"
						bind:value={password}
						placeholder="Password"
						autocapitalize="off"
						class="grow"
					/>
				{:else}
					<input
						id="password-input"
						type="password"
						placeholder="Password"
						bind:value={password}
						autocapitalize="off"
						class="grow"
					/>
				{/if}
				<div
					id="show-password"
					on:click|preventDefault|stopPropagation={() => (show = !show)}
					style="height: 100%"
				>
					<Eye size={'100%'} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#show-password {
    width: 2.5em;
		position: absolute;
		right: 0px;
	}
	#password {
		position: relative;
	}
	input {
		outline: none;
	}
	input,
	input:hover {
		border: 0;
	}
	input::placeholder {
		color: var(--main-blue);
	}
	.form-field {
		border-bottom: 1px solid var(--main-blue);
	}
	.form-field:hover {
		border: 1px solid var(--main-blue);
	}
</style>
