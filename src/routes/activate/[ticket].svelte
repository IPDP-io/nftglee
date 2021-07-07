<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { auth } from '$lib/api';

	const activate = (ticket) => {
		return auth.url('/activate').query({ ticket }).get().res();
	};

	let loading = true;
	let error, success;
	onMount(async () => {
		try {
			await activate($page.params.ticket);
			success = true;
		} catch (e) {
			try {
				error = JSON.parse(e.message).message;
			} catch (e) {
				console.log(e);
			}
		}
		loading = false;
	});
</script>

<div class="form-container bg-lightblue px-4">
	<form class="mb-6" autocomplete="off">
		{#if loading}
			Loading
		{:else if success}
			<h2 class="mb-8">Email confirmed!</h2>
			<p>Thank you! Your email is verified.</p>

			<div class="flex">
				<div class="ml-auto mt-8">
					<a href="/login" class="primary-btn">Continue to sign in</a>
				</div>
			</div>
		{:else}
			<h2 class="mb-8">Something went wrong</h2>
			<div>{error}</div>
			<div class="flex">
				<div class="ml-auto mt-8">
					<a href="/login" class="primary-btn">Continue to Raretoshi</a>
				</div>
			</div>
		{/if}
	</form>
</div>
