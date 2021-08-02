<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import * as animateScroll from 'svelte-scrollto';
	import { logout, requireLogin } from '$lib/auth';
	import { page, session } from '$app/stores';
	import { player, token } from '$lib/stores';
	import VolumeIconMute from '$icons/volume-mute.svelte';
  import Withdraw from "$components/withdraw.svelte";

	let nfts = {
		ticket: {
			filename: 'QmSmQduTPXamJBQLTxVs2nZAkVYdRWk7K1gqtQyqsBmNo8',
			name: 'Silhouettes Ticket Stub'
		},
		poster: {
			filename: 'QmdkU6rYPwHX5u3nq2omFKDUhoF3vhuaVqptWdwtAmB72d',
			name: 'Silhouettes Constellation Poster'
		},
		artwork: {
			filename: 'QmPnGapuS63Vy5J7K1CupGaoUVPM493jyhqZkDRYoNY7e2',
			name: 'Silhouettes Special Edition Artwork'
		}
	};

	onMount(async () => {
		await requireLogin();
		getGoodies();
	});

	let goodies = [];
	let getGoodies = async () => {
		goodies = await api.auth(`Bearer ${$token}`).url('/goodies').get().json();
		console.log('goodies', goodies);
	};

	let toggle = (e) => {
		e.target.muted = !e.target.muted;
	};

	let watch = async () => {
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
	<button on:click={watch}>Watch Now</button>
	<button on:click={logout}>Logout</button>
</div>

{#each goodies as goodie}
	<div class="container column goodie">
		<h3 class="nft-item">{nfts[goodie.type].name}</h3>
		<video class="goodie-video" muted playsinline autoplay loop type="video/mp4" on:click={toggle}>
			<source src={`/static/${nfts[goodie.type].filename}.mp4`} type="video/mp4" />
			Your browser does not support HTML5 video.
		</video>

    <Withdraw {goodie} />
	</div>
{/each}

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
	input {
		outline-color: var(--main-blue);
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
</style>
