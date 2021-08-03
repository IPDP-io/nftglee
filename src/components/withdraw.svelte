<script>
	import { withdraw } from '$lib/wallet';
	import { session } from '$app/stores';
	import { err } from '$lib/utils';

	export let goodie;
	export let goodies;

	let to;
	let from = $session.user;
	let withdrawing;
	let submit = async () => {
		try {
			await withdraw(goodie, from, to);
			goodies = goodies.filter((g) => g.txid !== goodie.txid);
		} catch (e) {
			err(e);
		}
	};
</script>

{#if withdrawing}
	<div id="withdraw" class="container column">
		<h2 class="nft-label">Withdraw to Liquid Address</h2>
		<h3 class="nft-item">
			You can use any Liquid wallet such as
			<a href="https://blockstream.com/green/" class="blockstream-green" target="_blank">
				Blockstream Green
			</a>
			or
			<a href="https://blockstream.com/aqua/" class="blockstream-aqua" target="_blank"> Aqua </a>
		</h3>
		<form on:submit|preventDefault={submit}>
			<div id="withdraw-form" class="container">
				<div class="container column">
					<div class="grow">
						<input
							class="withdraw"
							type="text"
							bind:value={to}
							placeholder="Withdraw Address"
							style="min-width: 36em"
						/>
					</div>
					<div>
						<button class="withdraw" type="submit">Withdraw</button>
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
