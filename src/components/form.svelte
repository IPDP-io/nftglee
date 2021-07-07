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

<form on:submit|preventDefault={submit}>
	{#if done}
    <h1>Thank you! </h1>
    <p>We'll be in touch soon</p>
	{:else}
		<div>
			<div>
				<input id="grid-first-name" type="text" placeholder="Name" bind:value={first} />
			</div>
		</div>
		<div>
			<div>
				<input id="email" type="email" placeholder="Email" bind:value={email} />
			</div>
		</div>
		<div>
			<div>
				<input id="suject" type="text" placeholder="Subject" bind:value={email} />
			</div>
		</div>
		<div>
			<div>
				<textarea id="message" placeholder="Type your message here..." bind:value={message} />
			</div>
		</div>
		<div>
			<div>
				<button id="submit" type="submit">
					Send
				</button>
			</div>
		</div>
	{/if}
</form>

<style>
	form {
		width: 75%;
		font-family: Helvetica;
	}
	input, #submit {
		height: 40px;
	}
	input, textarea {
		background-color: transparent;
		border: 0;
		border-bottom: 1px solid white;
		width: 100%;
		margin: 10px 0;
		color: white;
	}
	input::placeholder, textarea::placeholder {
		color: white;
	}
	input:hover, textarea:hover {
		border: 1px solid white;
	}
	button#submit {
		width: 100%;
	}
</style>
