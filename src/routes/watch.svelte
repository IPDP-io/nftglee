<script>
  import * as animateScroll from "svelte-scrollto";
	let to;
	let send;
	let asset;
	let movieTitle = 'Silhouettes';
	const fullDateOptions = { dateStyle: 'long', timeStyle: 'short' };
	const shortDateOptions = { dateStyle: 'short', timeStyle: 'short' };
	let date = new Date().toLocaleString('en-US', fullDateOptions);
	let shortDate = new Date().toLocaleString('en-US', shortDateOptions);

	let y;
	let scroll;

	let start = async () => {
		let { p2pml } = window;

    animateScroll.scrollToTop({ duration: 2000 })

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();
			const intro = document.getElementById('intro-video');
			const movieBanner = document.getElementById('movie-banner');
			const soundToggle = document.getElementById('sound-toggle');
			const videoOverlay = document.getElementById('video-overlay');

			if (soundToggle) soundToggle.remove();
			else return;

			videoOverlay.remove();
			intro.remove();

			const videoPlayer = document.createElement('div');
			videoPlayer.id = 'player';
			videoPlayer.style.width = '100%';
			videoPlayer.style.height = '100vh';
			movieBanner.appendChild(videoPlayer);
			var player = new Clappr.Player({
				parentId: '#player',
				source: '/file/playlist.m3u8',
        // source: '/static/silhouettes.mp4',
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

			p2pml.hlsjs.initClapprPlayer(player);

			console.log('scrolling');
			await tick();
		} else {
			setTimeout(loadVideo, 100);
		}
	};
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest/build/p2p-media-loader-hlsjs.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/clappr@latest"></script>
</svelte:head>

	<div class="container">
    <button on:click={start}>Watch Now</button>
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
	.movie-ticket,
	.goodie {
		padding: 1.5em 0;
	}
	.ticket {
		border: 0.2em dashed white;
		width: 50%;
		height: calc(75vw * 0.3);
		position: relative;
		padding: 1em 2em;
		background-color: #695a0f45;
		color: #00000085;
		font-size: 1.75vw;
		margin: 1.5em;
	}
	.ticket-left {
		justify-content: space-between;
	}
	.ticket-type {
		white-space: nowrap;
		padding: 0 1em;
	}
	.ticket-stub {
		border-left: 0.1em dashed #3c3c3c40;
		padding-left: 2em;
		text-align: center;
		justify-content: space-between;
	}
	.overlay {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 50%;
		transform: translateY(-50%);
		font-size: 7em;
		color: #ffffff47;
		font-family: 'Abril Fatface';
	}
	#ticket-overlay {
		left: 0.3em;
		font-size: 4em;
		text-transform: uppercase;
		font-family: 'Zen Tokyo Zoo';
	}
	#stub-overlay {
		right: 0.5em;
	}
	.ticket-left:before {
		content: '';
		position: absolute;
		display: block;
		height: 2em;
		width: 2em;
		left: -1em;
		top: -1em;
		border-radius: 50%;
		background-color: white;
	}
	.ticket-left:after {
		content: '';
		position: absolute;
		display: block;
		height: 2em;
		width: 2em;
		left: -1em;
		bottom: -1em;
		border-radius: 50%;
		background-color: white;
	}
	.ticket-stub:before {
		content: '';
		position: absolute;
		display: block;
		height: 2em;
		width: 2em;
		right: -1em;
		top: -1em;
		border-radius: 50%;
		background-color: white;
	}
	.ticket-stub:after {
		content: '';
		position: absolute;
		display: block;
		height: 2em;
		width: 2em;
		right: -1em;
		bottom: -1em;
		border-radius: 50%;
		background-color: white;
	}
	.ticket-prop {
		font-weight: 600;
		width: 4em;
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
		.ticket {
			font-size: 2vw;
		}
		.ticket,
		.goodie-video {
			width: 60%;
		}
		#ticket-overlay {
			font-size: 4em;
		}
		.ticket-stub {
			padding-left: 0;
		}
	}
	@media screen and (max-width: 481px) {
		.ticket,
		.goodie-video {
			width: 75%;
		}
		#ticket-overlay {
			font-size: 2em;
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
