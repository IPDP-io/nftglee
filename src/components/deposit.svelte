<script>
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import QRCode from 'qrcode';
	import { copy as copyToClipboard } from '$lib/utils';

	let copied;
	let copy = () => {
		copyToClipboard($session.user.address);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	};

	let qrCode;

	$: updateQr($session.user.address);
	let updateQr = (a) => {
		if (!a) return;
		QRCode.toString(
			$session.user.address,
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
	};
</script>

<div class="container column">
	<div class="container">Send to:</div>

	<div id="payment-qr-code" class="container column">
		<div class="container">
      {@html qrCode}
		</div>
		<div class="container column">
      <p
        id="payment-url"
        style="word-wrap: break-word; max-width: 600px; padding: 0 15px; margin: 0 auto; line-height: 1.5em;"
      >
        {$session.user.address}
      </p>
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
