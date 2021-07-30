<script>
	import { api } from '$lib/api';
	import { address as invoiceAddress, amount, loading, mnemonic, unit, ws } from '$lib/stores';
	import { go } from '$lib/utils';
	import { p2wpkh } from '$lib/wallet';
  import { send } from "$lib/socket";

	let getInvoice = async (u) => {
    $loading = true;
		$unit = u;

		let {
			address,
			redeem: { pubkey }
		} = p2wpkh();
    pubkey = pubkey.toString('hex');

		let invoice = await api
			.url('/' + u)
			.post({ address, pubkey })
			.json();

		$invoiceAddress = invoice.address;
		$amount = invoice.amount;

    console.log("sending subscribe", invoice.address, $ws.readyState);
		send('subscribe', invoice.address);

    $loading = false;
		go('/invoice');
	};
</script>

<div id="payment-options" class="container">
	<div class="container column">
		<h3>Choose preferred payment option:</h3>
		<div class="container space-evenly mb">
			<button on:click={() => ($unit = 'B')} class:active={$unit && $unit.includes('BTC')}>
				Bitcoin
			</button>
			<button on:click={() => getInvoice('LTC')} class:active={$unit === 'LTC'}> Litecoin </button>
		</div>
		{#if $unit && $unit.includes('B')}
			<div class="container space-evenly">
				<button
					class="secondary-btn"
					on:click={() => getInvoice('BTC')}
					class:active={$unit === 'BTC'}>On-chain</button
				>
				<button
					class="secondary-btn"
					on:click={() => getInvoice('LBTC')}
					class:active={$unit === 'LBTC'}>Liquid</button
				>
				<button
					class="secondary-btn"
					on:click={() => getInvoice('LNBTC')}
					class:active={$unit === 'LNBTC'}>Lightning</button
				>
			</div>
		{/if}
	</div>
</div>

<style>
	#payment-options h3 {
		text-align: center;
	}
</style>
