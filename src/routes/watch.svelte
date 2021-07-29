<script>
  import { onMount } from "svelte";
  import * as animateScroll from "svelte-scrollto";

	let y;
	let scroll;

	let loadVideo = async () => {
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
				// source: '/file/playlist.m3u8',
				source: '/static/silhouettes.mp4',
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

	onMount(loadVideo);
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest/build/p2p-media-loader-hlsjs.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/clappr@latest"></script>
</svelte:head>

<!-- <div id="player"></div> -->
<style>
	/* #player {
		width: 100%;
		height: 100vh;
	} */
</style>
