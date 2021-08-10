<script>
	import { onMount, onDestroy } from 'svelte';
	import { api } from '$lib/api';
	import * as animateScroll from 'svelte-scrollto';
	import { logout, requireLogin } from '$lib/auth';
	import { page, session } from '$app/stores';
	import { full, player, token } from '$lib/stores';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import Deposit from '$components/deposit.svelte';
	import Withdraw from '$components/withdraw.svelte';

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

	let interval;
	onMount(async () => {
		await requireLogin();
		await getGoodies();
		interval = setInterval(getGoodies, 5000);
	});

	onDestroy(() => clearInterval(interval));

	let goodies = [];
	let getGoodies = async () => {
		goodies = await api.auth(`Bearer ${$token}`).url('/goodies').get().json();
		goodies.sort((a, b) => (a.type === 'ticket' ? -1 : a.type === 'poster' ? -1 : 1));
	};

	let toggle = (e) => {
		muted = !muted;
		e.target.muted = !e.target.muted;
	};

	let depositing;
	let deposit = () => {
		depositing = true;
	};

	let watch = async () => {
		let { p2pml } = window;
		$full = true;

		animateScroll.scrollToTop({ duration: 2000 });

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine({
				loader: {
					xhrSetup: (xhr) => {
						xhr.setRequestHeader('Authorization', `Bearer ${$token}`);
					}
				}
			});
			const videoPlayer = document.getElementById('player');
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
			dataContainer.style.height = '100vh';

			p2pml.hlsjs.initClapprPlayer($player);
		} else {
			setTimeout(loadVideo, 100);
		}
	};
</script>

<svelte:head />

<div class="container" style="max-width: 40em; margin: 0 auto">
	{#if goodies.find((g) => g.type === 'ticket')}
		<button on:click={watch} style="flex-grow: 1">Watch Now</button>
	{:else}
		<button on:click={deposit} style="flex-grow: 1">Deposit a Ticket</button>
	{/if}

	<button on:click={logout} style="flex-grow: 1">Logout</button>
</div>

{#if depositing}
	<Deposit />
{/if}

{#each goodies as goodie (goodie.asset)}
	<div class="container column goodie">
		<h3 class="nft-item">{nfts[goodie.type].name}</h3>
    <div style="position: relative" class="goodie-video">
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
		width: 50%;
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
	#sound-toggle,
	#video-overlay {
		z-index: 9999;
	}
</style>
