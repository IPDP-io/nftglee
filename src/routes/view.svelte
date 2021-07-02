<script>
	import { onMount } from 'svelte';
	import { token } from '$lib/store';

	import qrcode from 'qrcode-generator-es6';

	const SATS = 100000000;

	let asset, img, vid, buying, selling, txid, ws;
	let received = 0;
	// let address = 'M9rSM2qFg8o81tNKbtvpavBJMEhfYKY6oi';
	let address = 'Qe8YqywBsx4QfD71dsPcF6kU3Jy6sc9hgP';
	let amount = 0.01;
	let to = 'AzpuQjLb2GbM37S6MiYM4CBVaLK7drpqqMqFUqwimGoStSrB5SgBGeD4JrTczVPmv4bUjcFmQdavUMh8';

	onMount(() => {
		let { Hls, p2pml } = window;

		var video = document.getElementById('video');
		var videoSrc = '/file/playlist.m3u8';

		if (Hls.isSupported() && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();

			var hls = new Hls({
				liveSyncDurationCount: 7, // To have at least 7 segments in queue
				loader: engine.createLoaderClass()
			});

			p2pml.hlsjs.initHlsJsPlayer(hls);
      console.log("skook");

			hls.loadSource(videoSrc);
			hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = videoSrc;
		}

		// ws = new WebSocket(`wss://ltc.coinos.io/ws`);
		ws = new WebSocket(`ws://localhost:9090/ws`);
		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'subscribe', value: address }));
		};

		ws.onmessage = ({ data }) => {
			try {
				let { type, value } = JSON.parse(data);

				if (type === 'payment') {
					buying = false;
					received += value;

					mint();
				}

				if (type === 'asset') {
					asset = value;
				}

				if (type === 'txid') {
					received = false;
					txid = value;
				}
			} catch (e) {
				console.log(e);
			}
		};
	});

	let sell = () => {
		asset = false;
		selling = true;
	};

	let btc = () => {};
	let lbtc = () => {};
	let lnbtc = () => {};
	let ltc = () => {
		const qr = new qrcode(0, 'H');
		selling = false;
		buying = true;
		qr.addData(`litecoin:${address}`);
		qr.make();
		img = qr.createSvgTag({});
	};

	let mint = () => {
		ws.send(JSON.stringify({ type: 'mint' }));
	};

	let send = () => {
		ws.send(JSON.stringify({ type: 'send', value: to, asset }));
	};
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@0.6.2/build/p2p-media-loader-core.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@0.6.2/build/p2p-media-loader-hlsjs.min.js"></script>
</svelte:head>

<main>
	<div style="width: 600px; margin: 0 auto;">
		Token: {$token}
		<video
			id="video"
			style="width: 100%; object-fit: cover"
			muted
			playsinline
			autoplay
			loop
			bind:this={vid}
			type="application/x-mpegURL"
		>
			<source src={'file/playlist.m3u8'} />
			Your browser does not support HTML5 video.
		</video>
	</div>
	<h1>Watch Silhouettes</h1>
	<!--
	{#if asset}
		<div>Asset created!</div>

		<div>Id: {asset}</div>

		<div style="margin-top: 10px">Ready to sell it?</div>
		<button on:click={sell}>Yes let's go</button>
	{:else if selling}
		<p>How much do you want for it?</p>
		<div>
			<input bind:value={amount} /> LTC
		</div>
		<button on:click={buy}>List it</button>
    -->
	{#if received}
		<p>
			Received {(received / SATS).toFixed(8)} LTC!
		</p>

		<h2>Your ticket</h2>
		<div
			color="mb-2"
			style="border: 1px dashed black; width: 600px; margin: 0 auto; padding: 20px; text-align: left;"
		>
			<div><b>Type:</b> Early bird (57 / 1000)</div>
			{#if asset}
				<div>
					<b>Asset ID:</b>
					<a href={`http://localhost:5005/asset/${asset}`}>{asset.substr(0, 20)}....</a>
				</div>
			{/if}
			<div><b>Date:</b> June 11, 2021</div>
		</div>

		<div style="width: 600px; margin: 0 auto;">
			<video
				style="width: 100%; object-fit: cover"
				muted
				playsinline
				autoplay
				loop
				type="application/x-mpegURL"
			>
				<source src={'/static/ticket.mp4'} />
				Your browser does not support HTML5 video.
			</video>
		</div>

		<h2>Extra NFT goodies</h2>

		<div style="width: 600px; margin: 0 auto;">
			<video style="width: 100%; object-fit: cover" muted playsinline autoplay loop>
				<source src={'/static/girl.mp4'} />
				Your browser does not support HTML5 video.
			</video>
		</div>

		<h2>Withdraw to Liquid Address</h2>
		<div>
			<input bind:value={to} style="width: 500px" />
		</div>
		<button on:click={send}>Withdraw</button>
	{:else if txid}
		<p>Token has been sent!</p>
		<p>Txid: {txid}</p>
	{:else}
		<h2>Payment Options</h2>
		<button on:click={btc}>Bitcoin</button>
		<button on:click={ltc}>Litecoin</button>
		<button on:click={lbtc}>Liquid</button>
		<button on:click={lnbtc}>Lightning</button>

		{#if buying}
			<div>Send {amount} LTC to:</div>
			<div class="qr">
				{@html img}
				<div>
					{address}
				</div>
			</div>
		{/if}
	{/if}
</main>

<style>
	b {
		display: inline-block;
		width: 100px;
	}

	.qr {
		margin: auto;
		width: 300px;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	input {
		padding: 10px;
	}

	button {
		background: none;
		border: 1px solid #ff3e00;
		border-radius: 5px;
		color: #ff3e00;
		cursor: pointer;
		text-transform: uppercase;
		font-size: 1.25rem;
		padding: 10px 20px;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
