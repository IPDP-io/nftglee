<script>
	import { withdraw } from '$lib/wallet';
	import { session } from '$app/stores';
	import { err } from '$lib/utils';

	export let goodie;
	export let goodies;

	let to;
	let withdrawing;
	let submit = async () => {
		try {
			await withdraw(goodie, $session.user, to);
			goodies = goodies.filter((g) => g.txid !== goodie.txid);
		} catch (e) {
			err(e);
		}
	};
</script>

{#if withdrawing}
	<div id="withdraw" class="container column">
		<h2 class="nft-label">Withdraw to Liquid Address</h2>
		<p class="nft-item">
			You can use any Liquid wallet such as
			<a href="https://blockstream.com/green/" class="blockstream-green" target="_blank"
				>Blockstream Green</a
			>,
			<a href="https://blockstream.com/aqua/" class="blockstream-aqua" target="_blank">Aqua</a>, or
			<a href="https://coinos.io" class="coinos" target="_blank"> Coinos </a>
		</p>
		{#if goodie.type === 'ticket'}
			<p class="container" style="padding: 0 2em">
				CAUTION: If you withdraw this ticket, you won't be able to continue watching the film until
				you re-deposit it into your account or buy a new one
			</p>
		{/if}
		<form on:submit|preventDefault={submit}>
			<div id="withdraw-form" class="container">
				<div class="container column" style="width: 100%">
          <textarea
            class="withdraw"
            type="text"
            bind:value={to}
            rows="5"
            placeholder="Withdraw Address"
            style="width: 100%; height: 6em"
          />
					<div>
						<button class="withdraw" type="submit" style="margin: 0 auto">Withdraw</button>
					</div>
				</div>
			</div>
		</form>
	</div>
{:else}
	<button on:click={() => (withdrawing = true)}>Send</button>
{/if}

<style>
	#withdraw {
		align-items: center;
		margin-top: 1.5em;
	}
	#withdraw-form {
		flex-wrap: wrap;
		align-items: center;
	}
	.withdraw {
		border: 2px solid var(--main-blue);
		height: 2rem;
		height: 5vh;
		margin: 1.5rem 0;
	}
	button.withdraw {
		transform: translateX(-1px);
		background-color: var(--main-blue);
		color: white;
	}
	button.withdraw:hover {
		background-color: var(--secondary-blue);
	}
	a.blockstream-green:hover {
		color: #00b45a;
	}
	a.blockstream-aqua:hover {
		color: #13cdc2;
	}
	a.coinos:hover {
		color: #faf601;
	}
	@media screen and (orientation: landscape) and (max-height: 600px) {
		.withdraw {
			height: 3vw;
		}
	}
	@media screen and (min-aspect-ratio: 3/4) and (max-aspect-ratio: 4/3) and (max-width: 769px) {
		.withdraw {
			height: 6vw;
		}
	}
</style>
