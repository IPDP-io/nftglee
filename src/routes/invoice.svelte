<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { address, unit } from '$lib/stores';
	import QRCode from 'qrcode';
	import PendingIcon from '$icons/pending.svelte';

	let amount = 20;
  	let btcAmount = .0002;
  	let ltcAmount = .2;
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
		$address = "bcasd098kjahsdkjya98s7d1234";
		// let rates = await api.url('/rates').get().json();
		// btcAmount = (amount / rates.btc).toFixed(8);
		// ltcAmount = (amount / rates.ltc).toFixed(8);
		// const canvas = document.getElementById('payment-qr-canvas');
		unitAmount = $unit === 'LTC'? ltcAmount : btcAmount;
		qrData = buildPaymentUrl($unit, $address, unitAmount, paymentLabel, paymentMessage );
		const qrOptions = {
			errorCorrectionLevel: 'H',
			type: 'svg',
			width: '250',
			height: '250',
			color: {
				dark: '#1f4e6c',
				light: '#FFFFFF'
			},
		};
		QRCode.toString(qrData, qrOptions, function (err, string) {
			if (err){
				throw err;
			}
			qrCode = string;
		});
		console.log(qrCode);
	});

	function buildPaymentUrl(coin, address, amount, label = 'Silhouettes', message = 'Movie ticket') {
		let protocol;
		switch(coin) {
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
			<a href="{qrData}" target="_blank">
				{@html qrCode}
				<!-- <canvas id="payment-qr-canvas"></canvas> -->
			</a>
		</div>
		<div class="container column">
			<a href="{qrData}" target="_blank">
				<p id="payment-url">{$address}</p>
			</a>
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
		font-size: 1rem;
	}
	#payment-qr-code p {
		font-size: 1rem;
		text-align: center;
		margin: 0;
	}
	#loading {
		text-align: center;
	}
	.hidden {
		background: red;
	}
	@media screen and (orientation: landscape) {
		#payment-qr-code canvas {
			width: 25vw !important;
		}
	}
</style>
