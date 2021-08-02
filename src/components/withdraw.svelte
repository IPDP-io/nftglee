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
	<form on:submit|preventDefault>
		<div id="withdraw-form" class="container">
			<div class="container grow">
				<div class="grow">
					<input class="withdraw" type="text" bind:value={to} placeholder="Withdraw Address" />
				</div>
				<div>
					<button class="withdraw" on:click={send}>Withdraw</button>
				</div>
			</div>
		</div>
	</form>
</div>

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
  </style>
