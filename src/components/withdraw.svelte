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
