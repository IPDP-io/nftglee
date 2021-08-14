<script>
	import { onMount, onDestroy } from 'svelte';
	import { api } from '$lib/api';
	import * as animateScroll from 'svelte-scrollto';
	import { logout, requireLogin } from '$lib/auth';
	import { page, session } from '$app/stores';
	import { full, player, token, ticket } from '$lib/stores';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import Deposit from '$components/deposit.svelte';
	import Withdraw from '$components/withdraw.svelte';
	import { ios } from '$lib/utils';

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

	let muted = true;
	let pending;

	let interval;
	onMount(async () => {
		pending = window.localStorage.getItem('pending');
		await requireLogin();
		await getGoodies();
		interval = setInterval(getGoodies, 5000);
	});

	onDestroy(() => clearInterval(interval));

	let goodies = [];
	let getGoodies = async () => {
		goodies = await api.auth(`Bearer ${$token}`).url('/goodies').get().json();
		goodies = goodies.sort((a, b) =>
			a.type === 'artwork' ? 1 : a.type === 'poster' && b.type === 'ticket' ? 1 : -1
		);
		$ticket = goodies.find((g) => g.type === 'ticket');

		if (goodies.length) {
			pending = false;
			window.localStorage.removeItem('pending');
		}
	};

	let toggle = (e) => {
		muted = !muted;
		e.target.muted = !e.target.muted;
	};

	let depositing;
	let deposit = () => (depositing = !depositing);

	let watch = async () => {
		let { p2pml } = window;
		$full = true;

		animateScroll.scrollToTop({ duration: 2000 });

		const videoPlayer = document.getElementById('player');
		const soundToggle = document.getElementById('sound-toggle');
		const videoOverlay = document.getElementById('video-overlay');

		if (soundToggle) soundToggle.remove();
		else return;

		videoOverlay.remove();

		videoPlayer.style.width = '100%';
		videoPlayer.style.height = '100vh';
		videoPlayer.querySelector('[data-container]').style.height = '100vh';
		$player.destroy();

		let loader;
		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine({
				loader: {
					xhrSetup: (xhr) => {
						xhr.setRequestHeader('Authorization', `Bearer ${$token}`);
					}
				}
			});

			loader = engine.createLoaderClass();

			$player = new Clappr.Player({
				parentId: '#player',
				source: '/file/playlist.m3u8',
				mute: false,
				autoPlay: false,
				width: '100%',
				height: '100%',
				playback: {
					hlsjsConfig: {
						liveSyncDurationCount: 7,
						loader
					}
				}
			});

			p2pml.hlsjs.initClapprPlayer($player);
		} else {
			$player = document.createElement('video');
			videoPlayer.append($player);
			$player.setAttribute('type', 'application/vnd.apple.mpegurl');
			$player.setAttribute('width', '100%');
			$player.setAttribute('height', '100%');
			$player.src = '/file/playlist.m3u8';
			$player.load();
			$player.play();
		}
	};
</script>

<svelte:head />

{#if pending}
	<p class="container" style="max-width: 40em; margin: 2em auto">
		Your transaction is pending. Could take up to 10 minutes.
	</p>
{/if}

<div class="container" style="max-width: 40em; margin: 0 auto 1em auto">
	<button
		on:click={watch}
		style="flex-grow: 1"
		disabled={!goodies.find((g) => g.type === 'ticket') || pending}>Watch Now</button
	>
	<button on:click={logout} style="flex-grow: 1">Logout</button>
</div>

<div class="container mb">
	<button on:click={deposit}>View Deposit Address</button>
</div>

{#if depositing}
	<Deposit />
{/if}

<div class="page-block">
	{#each goodies as goodie (goodie.asset)}
		<div class="container column goodie" key={goodie.asset}>
			<h3 class="nft-item">{nfts[goodie.type].name}</h3>
			<div style="position: relative" class="goodie-video mb">
				<div id="sound-toggle" style="cursor: pointer">
					{#if muted}
						<VolumeIconMute />
					{:else}
						<VolumeIconUp />
					{/if}
				</div>
				<video
					style="display: block; width: 100%"
					muted
					playsinline
					autoplay
					loop
					type="video/mp4"
					on:click={toggle}
					key={goodie.asset}
				>
					<source src={`/static/${nfts[goodie.type].filename}.mp4`} type="video/mp4" />
					Your browser does not support HTML5 video.
				</video>
			</div>

			<Withdraw {goodie} bind:goodies />
		</div>
	{/each}
</div>

<style>
	.goodie {
		padding: 1.5em 0;
	}
	.nft-item {
		margin-bottom: 0.25em;
	}
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
		width: 60%;
	}

	@media screen and (max-width: 769px) {
		.goodie-video {
			width: 80%;
		}
	}
	@media screen and (max-width: 481px) {
		.goodie-video {
			width: 85%;
		}
	}
	#sound-toggle {
		z-index: 9999;
	}

	button:disabled {
		border-color: #ccc;
		color: #ccc;
	}
</style>
