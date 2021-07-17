<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { address, unit } from '$lib/stores';
	import { copy as copyToClipboard } from '$lib/utils';
	import QRCode from 'qrcode';

	let amount = 20;
	let btcAmount;

	let ltcAmount, img;
	let qr;

	onMount(async () => {
		qr = await QRCode.toDataURL($address);

		let rates = await api.url('/rates').get().json();
		btcAmount = (amount / rates.btc).toFixed(8);
		ltcAmount = (amount / rates.ltc).toFixed(8);
	});

	let copied;
	let copy = () => {
		copyToClipboard($address);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	};
</script>

{#if btcAmount}
	<div class="container">Send {$unit === 'LTC' ? ltcAmount : btcAmount} {$unit} to:</div>

	<div class="container mb">
		<img src={qr} style="width: 400px" />
	</div>

	<div class="container mb">
		{$address}
	</div>

	<div class="container mb">
		<button on:click={copy}>
			{#if copied}
				Copied!
			{:else}
				Copy
          {/if}
		</button>
	</div>
{:else}
	<div class="container">-----------------------------</div>
{/if}
