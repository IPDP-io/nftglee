<script>
  import { onMount } from "svelte";
	import * as animateScroll from 'svelte-scrollto';
	import { logout, requireLogin } from '$lib/auth';
	import { page, session } from '$app/stores';
	import { player } from '$lib/stores';

  onMount(requireLogin);

	let to;
	let send;
	let asset;

	let start = async () => {
		let { p2pml } = window;

		animateScroll.scrollToTop({ duration: 2000 });

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();
			const videoPlayer = document.getElementById('player');
			const movieBanner = document.getElementById('movie-banner');
			const soundToggle = document.getElementById('sound-toggle');
			const videoOverlay = document.getElementById('video-overlay');

			if (soundToggle) soundToggle.remove();
			else return;

			videoOverlay.remove();

			videoPlayer.style.width = '100%';
			videoPlayer.style.height = '100vh';

			const playerDiv = document.getElementById('player');
			playerDiv.style.height = '100vh';

			$player.destroy();
			$player = new Clappr.Player({
				parentId: '#player',
				source: '/file/playlist.m3u8',
        // source: '/static/girl.mp4',
				mute: false,
				autoPlay: false,
				width: '100%',
				height: '100%',
				playback: {
					hlsjsConfig: {
						liveSyncDurationCount: 7,
						loader: engine.createLoaderClass()
					}
				}
			});

			const dataContainer = playerDiv.querySelector('[data-container]');
			console.log(playerDiv, dataContainer);
			dataContainer.style.height = '100vh';

			p2pml.hlsjs.initClapprPlayer($player);
		} else {
			setTimeout(loadVideo, 100);
		}
	};
</script>

<svelte:head />

<div class="container">
	<button on:click={start}>Watch Now</button>
	<button on:click={logout}>Logout</button>
</div>

<div class="container column goodie">
	<h2 class="nft-label">NFT Goodies</h2>
	<h3 class="nft-item">Silhouettes Ticket Stub</h3>
	<video class="goodie-video" muted playsinline autoplay loop type="application/x-mpegURL">
		<source src={'/static/ticket.mp4'} />
		Your browser does not support HTML5 video.
	</video>
</div>

<div class="container column goodie">
	<h2 class="nft-label">Extra NFT goodies</h2>
	<h3 class="nft-item">Constellation Poster</h3>
	<video class="goodie-video" muted playsinline autoplay loop type="application/x-mpegURL">
		<source src={'/static/girl.mp4'} />
		Your browser does not support HTML5 video.
	</video>
</div>

<div id="withdraw" class="container column">
	<h2 class="nft-label">Withdraw to Liquid Address</h2>
	<h3 class="nft-item">
		You can use any Liquid wallet such as
		<a href="https://blockstream.com/green/" class="blockstream-green" target="_blank">
			Blockstream Green
		</a>
		or
		<a href="https://blockstream.com/aqua/" class="blockstream-aqua" target="_blank"> Aqua </a>
	</h3>
	<form on:submit|preventDefault>
		<div id="withdraw-form" class="container">
			<div class="container grow">
				<div class="grow">
					<input class="withdraw" type="text" bind:value={to} placeholder="Withdraw Address" />
				</div>
				<div>
					<button class="withdraw" on:click={send}>Withdraw</button>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.goodie {
		padding: 1.5em 0;
	}
	.nft-label {
		margin-bottom: 1em;
	}
	.nft-item {
		margin-bottom: 0.25em;
	}
	.nft-label,
	.nft-item {
		text-align: center;
	}
	.goodie {
		align-items: center;
		border-bottom: 1px solid var(--main-blue);
		padding-bottom: 4em;
	}
	.goodie:nth-child(odd) {
		background-color: #eeeeee;
	}
	.goodie-video {
		width: 50%;
	}
	#withdraw {
		align-items: center;
		margin-top: 1.5em;
	}
	#withdraw-form {
		flex-wrap: wrap;
		align-items: center;
	}
	.withdraw {
		border: 2px solid var(--main-blue);
		height: 2rem;
		height: 5vh;
		margin: 1.5rem 0;
	}
	button.withdraw {
		transform: translateX(-1px);
		background-color: var(--main-blue);
		color: white;
	}
	input {
		outline-color: var(--main-blue);
	}
	button.withdraw:hover {
		background-color: var(--secondary-blue);
	}
	a.blockstream-green:hover {
		color: #00b45a;
	}
	a.blockstream-aqua:hover {
		color: #13cdc2;
	}

	@media screen and (max-width: 769px) {
		.goodie-video {
			width: 60%;
		}
	}
	@media screen and (max-width: 481px) {
		.goodie-video {
			width: 75%;
		}
	}
	@media screen and (orientation: landscape) and (max-height: 600px) {
		.withdraw {
			height: 3vw;
		}
	}
	@media screen and (min-aspect-ratio: 3/4) and (max-aspect-ratio: 4/3) and (max-width: 769px) {
		.withdraw {
			height: 6vw;
		}
	}
</style>
