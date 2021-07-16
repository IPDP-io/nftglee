<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { address, unit } from '$lib/stores';
	import qrcode from 'qrcode-generator-es6';

	let amount = 20;
  let btcAmount;

  let ltcAmount, img;

	onMount(async () => {
    $address = "bcasd098kjahsdkjya98s7d1234";
		const qr = new qrcode(0, 'H');
		qr.addData($address);
		qr.make();
		img = qr.createSvgTag({});

		let rates = await api.url('/rates').get().json();
    // btcAmount = (amount / rates.btc).toFixed(8);
		ltcAmount = (amount / rates.ltc).toFixed(8);
	});
</script>

{#if btcAmount}
	<div class="container">Send {$unit === 'LTC' ? ltcAmount : btcAmount} {$unit} to:</div>

	<div class="qr">
		{@html img}
		<div class="mb">
			{$address}
		</div>
	</div>
{:else}
  <div class="container">-----------------------------</div>
{/if}

<style>
	.hidden {
		background: red;
	}
</style>
