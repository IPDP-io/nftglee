<script>
	import { onMount } from 'svelte';
	import { api, auth } from '$lib/api';
	import Form from '../components/form.svelte';
	import Login from '../components/login.svelte';
	import { session } from '$app/stores';

	import qrcode from 'qrcode-generator-es6';

	const SATS = 100000000;

	const logout = async () => {
		try {
			let refresh_token = $session.user.token;

			await auth.url('/logout').query({ refresh_token }).post().res();

			$session.user = undefined;
		} catch (e) {
			console.log(e);
		}
	};

	let asset, img, vid, buying, selling, txid, ws;
	let received = 0;
	let address = 'Qe8YqywBsx4QfD71dsPcF6kU3Jy6sc9hgP';
	let to = 'AzpuQjLb2GbM37S6MiYM4CBVaLK7drpqqMqFUqwimGoStSrB5SgBGeD4JrTczVPmv4bUjcFmQdavUMh8';

	let loadVideo = () => {
		let { p2pml } = window;

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();

			var player = new Clappr.Player({
				parentId: '#player',
				source: '/file/playlist.m3u8',
				mute: true,
				autoPlay: true,
				playback: {
					hlsjsConfig: {
						liveSyncDurationCount: 7,
						loader: engine.createLoaderClass()
					}
				}
			});

			p2pml.hlsjs.initClapprPlayer(player);
		} else {
			setTimeout(loadVideo, 100);
		}
	};

	let amount = 20;
  let btcAmount, ltcAmount;

	onMount(async () => {
		const movieBanner = document.getElementById('movie-banner');
		const introVideo = document.getElementById('intro-video');
		movieBanner.addEventListener('click', () => {
			introVideo.muted = !introVideo.muted;
			document.querySelectorAll('.sound-icon').forEach((icon) => icon.classList.toggle('hidden'));
		});

		let rates = await api.url('/rates').get().json();
		btcAmount = (amount / rates.btc).toFixed(8);
		ltcAmount = (amount / rates.ltc).toFixed(8);

		loadVideo();
		// ws = new WebSocket(`wss://ltc.coinos.io/ws`);
		ws = new WebSocket(`ws://localhost:9090/ws`);
		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'subscribe', value: address }));
		};

		ws.onmessage = ({ data }) => {
			console.log(data);
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

	let unit;
	let getInvoice = async (u) => {
		unit = u;
		selling = false;
		buying = true;

		({ address } = await api
			.url('/' + u)
			.post({
				amount: 10000
			})
			.json());

		ws.send(JSON.stringify({ type: 'subscribe', value: address }));
		qr(`bitcoin:${address}`);
	};

	let qr = (text) => {
		const qr = new qrcode(0, 'H');
		qr.addData(text);
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
	<title>Silhouettes</title>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest/build/p2p-media-loader-hlsjs.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/clappr@latest"></script>
</svelte:head>

<section>
	<div id="movie-banner" class="container">
		<div id="sound-toggle">
			<i class="fas fa-volume-mute fa-2x sound-icon" />
			<i class="fas fa-volume-up fa-2x sound-icon hidden" />
		</div>
		<div id="video-overlay">
			<svg
				id="scroll-down-arrow"
				preserveAspectRatio="none"
				viewBox="20 20 160 160"
				xmlns="http://www.w3.org/2000/svg"
				data-type="shape"
				role="presentation"
				aria-hidden="true"
			>
				<g>
					<path
						d="M180 100c0-44.184-35.817-80-80.001-80C55.817 20 20 55.817 20 100s35.817 80 79.999 80S180 144.183 180 100zm-87.148 30.82l-31.79-31.792a10.075 10.075 0 0 1-2.961-7.148c0-2.587.987-5.174 2.961-7.148 3.948-3.948 10.348-3.948 14.296 0L100 109.374l24.642-24.641c3.948-3.948 10.348-3.948 14.297 0 3.948 3.948 3.948 10.348 0 14.296l-31.79 31.791c-3.948 3.947-10.349 3.947-14.297 0z"
					/>
				</g>
			</svg>
			<p>Scroll to begin</p>
		</div>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video id="intro-video" autoplay muted>
			<source src="/silhouettes.mp4" type="video/mp4" />
		</video>
	</div>
	<div id="watch-silhouettes" class="container column">
		<div class="container">
			<h1>Watch Silhouettes</h1>
		</div>
		<!--
		<div class="container">
			{#if $session.user}
				<div>
					Signed in as {$session.user.email}
				</div>
				<button on:click={logout}>Sign out</button>
			{:else}
				<Login />
			{/if}
		</div>
    -->
		<div id="payment-options" class="container">
			<div class="container column">
				<h3>Choose preferred payment option:</h3>
				<div class="container space-around mb">
          <button on:click={() => getInvoice('BTC')} class:active={unit === 'BTC'}>Bitcoin</button>
					<button on:click={() => getInvoice('LTC')} class:active={unit === 'LTC'}>Litecoin</button>
				</div>
				{#if unit && unit.includes('BTC')}
					<div class="container space-around">
						<button on:click={() => getInvoice('BTC')} class:active={unit === 'BTC'}>On-chain</button>
						<button on:click={() => getInvoice('LBTC')} class:active={unit === 'LBTC'}>Liquid</button>
						<button on:click={() => getInvoice('LNBTC')} class:active={unit === 'LNBTC'}>Lightning</button>
					</div>
				{/if}
			</div>
		</div>

		<div class="container">
			{#if received}
				<p>
					Received {(received / SATS).toFixed(8)}
					{unit}!
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
			{:else if buying}
				<div>Send {unit === 'LTC' ? ltcAmount : btcAmount} {unit} to:</div>
				<div class="qr">
					{@html img}
					<div>
						{address}
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div id="lets-chat" class="container column">
		<div class="container">
			<h2>Let's chat</h2>
		</div>
		<div class="container">
			<Form />
		</div>
	</div>
</section>

<style>
	section {
		color: var(--main-blue);
	}

	#movie-banner {
		align-items: flex-end;
		position: relative;
	}
	#sound-toggle {
		font-size: 0.8rem;
		font-size: 1vw;
		position: absolute;
		left: 15px;
		left: 1.5vh;
		top: 15px;
		top: 1.5vh;
	}
	#video-overlay {
		display: inline-block;
		text-align: center;
		position: absolute;
		width: 20%;
		padding-bottom: 2%;
	}
	#video-overlay p {
		margin: 0;
		text-transform: uppercase;
		font-size: 35px;
		font-size: 3vw;
	}
	#scroll-down-arrow {
		width: 25%;
		height: auto;
	}
	#scroll-down-arrow path {
		fill: var(--main-blue);
	}
	#intro-video {
		width: 100%;
	}
	#payment-options {
		margin-bottom: 2rem;
	}
	#lets-chat {
		font-family: 'Oswald', sans-serif;
		background-color: var(--main-blue);
		color: white;
		padding-bottom: 2rem;
	}

	button {
		cursor: pointer;
		background-color: transparent;
		border: 5px solid var(--main-blue);
		height: 40px;
		margin: 0 10px;
		font-size: 24px;
		padding: 0 10px;
		color: var(--mainblue);
		transition: 0.6s;
	}
	button:hover,
	button.active {
		background-color: var(--main-blue);
		color: white;
		transition: 0.6s;
	}

	@media screen and (max-width: 1025px) {
		#sound-toggle {
			font-size: 0.7rem;
			font-size: 1.5vw;
		}
	}
	@media screen and (max-width: 769px) {
		#sound-toggle {
			font-size: 0.6rem;
			font-size: 1.5vw;
		}
		button {
			font-size: 15px;
			font-size: 2.25vw;
		}
	}
	@media screen and (max-width: 481px) {
		#sound-toggle {
			font-size: 0.5rem;
			font-size: 1.75vw;
		}
		button {
			font-size: 12px;
			font-size: 1.5vh;
		}
	}
	@media screen and (max-width: 320px) {
		#sound-toggle {
			font-size: 3vw;
		}
	}
	@media (orientation: landscape) {
		button {
			height: 4vw;
			font-size: 2vw;
		}
		#sound-toggle {
			font-size: 1vw;
		}
	}
	@media (orientation: landscape) and (max-width: 769px) {
		#sound-toggle {
			font-size: 1.5vw;
		}
	}

	.qr {
		margin: auto;
		width: 300px;
	}

	.mb {
		margin-bottom: 10px;
	}
</style>
