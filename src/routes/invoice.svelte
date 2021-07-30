<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import QRCode from 'qrcode';
	import PendingIcon from '$icons/pending.svelte';
	import { address, amount, unit } from '$lib/stores';
	import { copy as copyToClipboard } from '$lib/utils';

	let copied;
	let copy = () => {
		copyToClipboard($address);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	};

	let qrData;
	let qrCode;

	let ticketNumber;

	$: tier = ticketNumber < 100 ? 1 : ticketNumber < 1000 ? 2 : 3;

	const paymentLabel = 'Silhouettes';
	const paymentMessage = 'Movie ticket';

	onMount(async () => {
		ticketNumber = await api.url('/ticket').get().json();

		QRCode.toString(
			`${
				$unit === 'LTC' ? 'litecoin' : 'bitcoin'
			}:${$address}?amount=${$amount}&label=Silhouettes&message=Movie%20ticket`,
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
				width: '250',
				height: '250',
				color: {
					dark: '#1f4e6c',
					light: '#FFFFFF'
				}
			},
			function (err, string) {
				if (err) {
					throw err;
				}
				qrCode = string;
			}
		);
	});

	let showInfo;
</script>

<div class="container column">
	<div class="container mb">
		Purchasing ticket #{ticketNumber + 1}, a Tier {tier} ticket
	</div>
	<div class="container">
		<button on:click={() => (showInfo = !showInfo)}>What does that mean?</button>
	</div>
	{#if showInfo}
		<img src="/static/tiers.png" alt="Silhouette Tiers" style="max-width: 600px; margin: 0 auto;" />
    <div class="container mb">
		<button on:click={() => (showInfo = !showInfo)}>Got it</button>
  </div>
	{/if}

	<div class="container">Send {$amount} {$unit} ($20) to:</div>

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
</div>

<style>
	#payment-qr-code {
		width: 100%;
	}
	#payment-qr-code p {
		text-align: center;
		margin: 0;
	}
</style>
