<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { address, unit } from '$lib/stores';
	import qrcode from 'qrcode-generator-es6';

	let amount = 20;
	let btcAmount, ltcAmount, img;

	onMount(async () => {
		const qr = new qrcode(0, 'H');
		qr.addData($address);
		qr.make();
		img = qr.createSvgTag({});

		let rates = await api.url('/rates').get().json();
		btcAmount = (amount / rates.btc).toFixed(8);
		ltcAmount = (amount / rates.ltc).toFixed(8);
	});
</script>

<div class="container">Send {$unit === 'LTC' ? ltcAmount : btcAmount} {$unit} to:</div>

<div class="qr">
	{@html img}
	<div class="mb">
		{$address}
	</div>
</div>
