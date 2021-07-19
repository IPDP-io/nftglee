<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import QRCode from 'qrcode';
	import PendingIcon from '$icons/pending.svelte';
	import { address, unit } from '$lib/stores';
	import { copy as copyToClipboard } from '$lib/utils';

	let copied;
	let copy = () => {
		copyToClipboard($address);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	};

	let amount = 20;
	let btcAmount = 0.0002;
	let ltcAmount = 0.2;
	let qrData;
	let unitAmount;
	let qrCode;
	let test = false;
	setTimeout(() => {
		test = true;
	}, 1500);

	const paymentLabel = 'Silhouettes';
	const paymentMessage = 'Movie ticket';

	onMount(async () => {
		$address = 'bcasd098kjahsdkjya98s7d1234';
		// let rates = await api.url('/rates').get().json();
		// btcAmount = (amount / rates.btc).toFixed(8);
		// ltcAmount = (amount / rates.ltc).toFixed(8);
		unitAmount = $unit === 'LTC' ? ltcAmount : btcAmount;
		qrData = buildPaymentUrl($unit, $address, unitAmount, paymentLabel, paymentMessage);
		const qrOptions = {
			errorCorrectionLevel: 'H',
			type: 'svg',
			width: '250',
			height: '250',
			color: {
				dark: '#1f4e6c',
				light: '#FFFFFF'
			}
		};
		QRCode.toString(qrData, qrOptions, function (err, string) {
			if (err) {
				throw err;
			}
			qrCode = string;
		});
		console.log(qrCode);
	});

	function buildPaymentUrl(coin, address, amount, label = 'Silhouettes', message = 'Movie ticket') {
		let protocol;
		switch (coin) {
			case 'LTC':
				protocol = 'litecoin';
				break;
			case 'BTC':
				protocol = 'bitcoin';
				break;
		}
		return `${protocol}:${address}?amount=${amount}&label=${label}&message=${message}`;
	}
</script>

<div class="container column">
	{#if test}
		<div class="container">Send {unitAmount} {$unit} (${amount}) to:</div>

		<div id="payment-qr-code" class="container column">
			<div class="container">
				<a href={qrData} target="_blank">
					{@html qrCode}
				</a>
			</div>
			<div class="container column">
				<a href={qrData} target="_blank">
					<p id="payment-url">{$address}</p>
				</a>
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
		</div>
	{:else}
		<div id="loading" class="container column">
			<div class="container">
				<h3>Loading</h3>
			</div>
			<div class="container">
				<PendingIcon size="medium" />
			</div>
		</div>
	{/if}
</div>

<style>
	#payment-qr-code {
		width: 100%;
	}
	#payment-qr-code p {
		text-align: center;
		margin: 0;
	}
	#payment-qr-code svg {
		width: 35vh;
		height: auto;
	}
	#loading {
		text-align: center;
	}
	.hidden {
		background: red;
	}
</style>
