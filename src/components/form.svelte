<script>
	import wretch from 'wretch';
	let done, first, last, email, message;

	let submit = async () => {
		await wretch()
			.url('/api/contact')
			.post({
				first,
				last,
				email,
				message
			})
			.json()
			.catch(console.log);

		done = true;
	};
</script>

<form class="w-full bg-black p-12 rounded-xl" on:submit|preventDefault={submit}>
	{#if done}
    <h1 class="text-4xl text-primary mb-2">Thank you! </h1>
    <p class="text-xl text-white">We'll be in touch soon</p>
	{:else}
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label
					class="block uppercase tracking-wide text-white text-xs font-bold mb-2"
					for="grid-first-name"
				>
					First Name
				</label>
				<input id="grid-first-name" type="text" placeholder="Jane" bind:value={first} />
			</div>
			<div class="w-full md:w-1/2 px-3">
				<label
					class="block uppercase tracking-wide text-white text-xs font-bold mb-2"
					for="grid-last-name"
				>
					Last Name
				</label>
				<input id="grid-last-name" type="text" placeholder="Doe" bind:value={last} />
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-white text-xs font-bold mb-2"
					for="grid-password"
				>
					E-mail
				</label>
				<input id="email" type="email" bind:value={email} />
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-white text-xs font-bold mb-2"
					for="grid-password"
				>
					Message
				</label>
				<textarea class="no-resize h-48 resize-none" id="message" bind:value={message} />
			</div>
		</div>
		<div class="md:flex md:items-center">
			<div class="md:w-1/3">
				<button
					class="text-white shadow bg-primary focus:shadow-outline focus:outline-none py-2 px-4 rounded"
					type="submit"
				>
					Send
				</button>
			</div>
			<div class="md:w-2/3" />
		</div>
	{/if}
</form>

<style>
	input,
	textarea {
		@apply appearance-none block w-full border border-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500;
	}
</style>
