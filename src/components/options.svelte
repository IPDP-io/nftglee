<script>
	import { api } from '$lib/api';
	import { session } from '$app/stores';
	import { address as invoiceAddress, amount, loading, mnemonic, unit, ws } from '$lib/stores';
	import { go } from '$lib/utils';
	import { p2wpkh } from '$lib/wallet';
	import { send } from '$lib/socket';

	let getInvoice = async (u) => {
		$loading = true;
		$unit = u;

		let {
			address,
			redeem: { pubkey }
		} = p2wpkh($session.user);
		pubkey = pubkey.toString('hex');

		let invoice = await api
			.url('/' + u)
			.post({ address, pubkey })
			.json();

		$invoiceAddress = invoice.address;
		$amount = invoice.amount;

		send('subscribe', invoice.address);

		$loading = false;
		go('/invoice');
	};
</script>

<div id="payment-options" class="container">
	<div class="container column">
		{#if $unit}
			<h3>Other payment options:</h3>

				<div class="container space-evenly">
          {#if $unit !== 'BTC'}
					<button
						on:click={() => getInvoice('BTC')}
						class:active={$unit === 'BTC'}>Bitcoin</button
					>
          {/if}
          {#if $unit !== 'LBTC'}
					<button
						on:click={() => getInvoice('LBTC')}
						class:active={$unit === 'LBTC'}>Liquid</button
					>
          {/if}
          {#if $unit !== 'LNBTC'}
					<button
						on:click={() => getInvoice('LNBTC')}
						class:active={$unit === 'LNBTC'}>Lightning</button
					>
          {/if}
          {#if $unit !== 'LTC'}
          <button on:click={() => getInvoice('LTC')} class:active={$unit === 'LTC'}> Litecoin </button>
          {/if}
				</div>
		{:else}
			<h3>Choose a payment option:</h3>
		<div class="container space-evenly mb">
			<button on:click={() => getInvoice('BTC')} class:active={$unit && $unit.includes('BTC')}>
				Bitcoin
			</button>
			<button on:click={() => getInvoice('LTC')} class:active={$unit === 'LTC'}> Litecoin </button>
		</div>
		{/if}
	</div>
</div>

<style>
	#payment-options h3 {
		text-align: center;
	}
</style>
