<script>
	import { onMount } from 'svelte';

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

	onMount(loadVideo);
</script>

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest/build/p2p-media-loader-hlsjs.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/clappr@latest"></script>
</svelte:head>
