<script>
	import wretch from 'wretch';
	import PendingIcon from '$icons/pending.svelte';

	let done, first, last, email, message, subject, loading;

	let submit = async () => {
		loading = true;
		await wretch()
			.url('/api/contact')
			.post({
				first,
				last,
				email,
				subject,
				message
			})
			.json()
			.catch(console.log);

		loading = false;
		done = true;
	};
</script>

<div id="lets-chat" class="container column page-block">
	<div class="container">
		<form on:submit|preventDefault={submit}>
			{#if done}
				<h1 class="container mb">Thank you!</h1>
				<p class="container">We'll be in touch soon</p>
			{:else if loading}
				<div id="loading" class="container column">
					<div class="container">
						<PendingIcon size="medium" white={true} />
					</div>
				</div>
			{:else}
				<div class="container">
					<h2>Let's chat</h2>
				</div>
				<div class="form-field">
					<div>
						<input id="grid-first-name" type="text" placeholder="Name" bind:value={first} />
					</div>
				</div>
				<div class="form-field">
					<div>
						<input id="email" type="email" placeholder="Email" bind:value={email} />
					</div>
				</div>
				<div class="form-field">
					<div>
						<input id="subject" type="text" placeholder="Subject" bind:value={subject} />
					</div>
				</div>
				<div class="form-field">
					<div>
						<textarea id="message" placeholder="Type your message here..." bind:value={message} />
					</div>
				</div>
				<div class="form-field">
					<div>
						<button id="submit" type="submit"> Submit </button>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>

<style>
	input,
	textarea {
		background-color: transparent;
		border-bottom: 1px solid white;
		color: white;
	}
	textarea#message {
		height: 10em;
	}
	#submit {
		width: 100%;
		margin: 0;
		background-color: white;
		color: var(--main-blue);
	}

	input::placeholder,
	textarea::placeholder {
		color: white;
	}
	input:hover,
	textarea:hover {
		border: 1px solid white;
	}
	button[type='submit']:hover {
		background-color: #ffffffaa;
		color: white;
	}
</style>
