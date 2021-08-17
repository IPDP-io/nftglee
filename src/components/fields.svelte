<script>
	import { focus } from '$lib/utils';
  import Password from "$components/password.svelte";
	import { onMount } from 'svelte';
	export let email, password;

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
				bind:value={email}
				placeholder="Email"
				autocapitalize="off"
				class="grow"
				use:focus
			/>
		</div>
	</div>
  <Password bind:password />
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
