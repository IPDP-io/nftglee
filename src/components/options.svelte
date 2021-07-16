<script>
	import { api } from '$lib/api';
	import { address, unit, ws } from '$lib/stores';
	import { goto } from '$app/navigation';

	let getInvoice = async (u) => {
		$unit = u;

		$address = (await api
			.url('/' + u)
			.post({
				amount: 10000
			})
			.json()).address;

		$ws.send(JSON.stringify({ type: 'subscribe', value: $address }));

    goto('/invoice', { noscroll: true });
	};
</script>

<div id="payment-options" class="container">
	<div class="container column">
		<h3>Choose preferred payment option:</h3>
		<div class="container space-around mb">
			<button on:click={() => getInvoice('BTC')} class:active={$unit && $unit.includes('BTC')}
				>Bitcoin</button
			>
			<button on:click={() => getInvoice('LTC')} class:active={$unit === 'LTC'}>Litecoin</button>
		</div>
		{#if $unit && $unit.includes('BTC')}
			<div class="container space-around">
				<button on:click={() => getInvoice('BTC')} class:active={$unit === 'BTC'}>On-chain</button>
				<button on:click={() => getInvoice('LBTC')} class:active={$unit === 'LBTC'}>Liquid</button>
				<button on:click={() => getInvoice('LNBTC')} class:active={$unit === 'LNBTC'}
					>Lightning</button
				>
			</div>
		{/if}
	</div>
</div>
