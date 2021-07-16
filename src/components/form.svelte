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
				<input id="suject" type="text" placeholder="Subject" bind:value={email} />
			</div>
		</div>
		<div class="form-field">
			<div>
				<textarea id="message" placeholder="Type your message here..." bind:value={message} />
			</div>
		</div>
		<div class="form-field">
			<div>
				<button id="submit" type="submit">
					Submit
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
	.form-field {
		margin: 10px 0;
	}
	input {
		height: 2rem;
		height: 5vh;
	}
	textarea {
		height: 4rem;
		height: 15vh;
		resize : vertical;
	}
	input, textarea {
		background-color: transparent;
		border: 0;
		border-bottom: 1px solid white;
		width: 100%;
		padding: 0;
		font-size: 12px;
		font-size: 1.8vh;
		color: white;
	}
	input::placeholder, textarea::placeholder {
		color: white;
	}
	input:hover, textarea:hover {
		border: 1px solid white;
	}
	button#submit {
		height: 2.5rem;
		height: 8vh;
		width: 100%;
		padding: 0;
		font-size: 14px;
		font-size: 2vh;
		border: 0;
		transition: .6s;
	}
	button#submit:hover {
		background-color: #ffffffaa;
		color: white;
		transition: .4s;
		
	}

	@media screen and (max-width: 1025px) {
		button#submit {
			height:7vh;
		}
	}
	@media screen and (max-width: 769px) {
		button#submit {
			height:6vh;
		}
	}
	@media screen and (max-width: 481px) {
		button#submit {
			height:5vh;
		}
	}
	@media (orientation: landscape) {
		input, textarea {
			font-size: 1.5vw;
		}
		button#submit {
			font-size: 1.5vw;
		}
	}
</style>
