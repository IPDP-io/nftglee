<script>
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import { address, error, mnemonic, initialized, player, token, ws } from '$lib/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import About from '$components/about.svelte';
	import Contact from '$components/contact.svelte';
	import { err, go } from '$lib/utils';
	import socket from '$lib/socket';
	import { createWallet, setup } from '$lib/wallet';
	import { api } from '$lib/api';
	import { getToken } from '$lib/auth';
	import * as animateScroll from 'svelte-scrollto';

	import '../app.css';

	let trailer = () => {
		let { p2pml } = window;

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();
			const intro = document.getElementById('intro-video');
			const movieBanner = document.getElementById('movie-banner');

			$player = new Clappr.Player({
				parentId: '#player',
				source: '/trailer/playlist.m3u8',
				autoPlay: true,
				mute: true,
				hideMediaControl: true,
				chromeless: true,
				width: '100%',
				height: '100%',
				playback: {
					hlsjsConfig: {
						liveSyncDurationCount: 7,
						loader: engine.createLoaderClass()
					}
				}
			});

			$player.getPlugin('click_to_pause').disable();

			p2pml.hlsjs.initClapprPlayer($player);
		} else {
			setTimeout(loadVideo, 100);
		}
	};

	token.subscribe(async (t) => {
		if (t && !$session.user) {
			let user = await api.auth(`Bearer ${t}`).url('/user').get().json();
      user.token = t;
			if (user.mnemonic) $session.user = user;
		}
	});

	const year = new Date().getFullYear();

	onMount(async () => {
		setupScrollFade();
		await getToken();
		trailer();
		socket();
		setup();
		if (!$session.user) $session.user = await createWallet();
		$initialized = true;
	});

	function setupScrollFade() {
		const fadeElement = document.getElementById('movie-banner');
		let scrollFadeHeight = fadeElement.offsetHeight;
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				scrollFadeHeight = entry.contentRect.height;
			}
		});
		resizeObserver.observe(fadeElement);
		window.addEventListener('scroll', () => handleScrollFade(scrollFadeHeight, fadeElement));
	}

	function handleScrollFade(scrollFadeHeight, fadeElement) {
		let opacity = 1;
		const currentPosition = window.pageYOffset;
		if (currentPosition <= scrollFadeHeight) {
			opacity = 1 - currentPosition / scrollFadeHeight;
		} else {
			opacity = 0;
		}
		fadeElement.style.opacity = opacity;
	}

	let muted = true;
	let toggle = () => {
		muted = !muted;
		muted ? $player.mute() : $player.unmute();
	};

	$: clear($page);
	let clear = () => err(undefined);
	let scrollDown = () => {
		animateScroll.scrollTo({ element: '#watch-silhouettes', duration: 800 });
	};
</script>

<main>
	<section>
		<div id="movie-banner" class="container" on:click={toggle}>
			<div id="sound-toggle" style="cursor: pointer">
				{#if muted}
					<VolumeIconMute />
				{:else}
					<VolumeIconUp />
				{/if}
			</div>
			<div
				id="video-overlay"
				on:click|preventDefault|stopPropagation={scrollDown}
				style="cursor: pointer"
			>
				<Down />
			</div>
			<div id="player" />
		</div>

		<div id="watch-silhouettes" class="container column">
			<div class="container page-block">
				<h1 on:click={() => go('/')}>Silhouettes</h1>
			</div>

			{#if $initialized}
				{#if $error}
					<div class="container" style="color: red">{$error}</div>
				{/if}

				{#if $session.user.email}
					<div class="container">
						Signed in as {$session.user.email}
					</div>
				{/if}

				<div style="min-height: 400px" class="page-block">
					<slot />
					<Contact />
					<About />
				</div>
			{/if}
		</div>
	</section>
</main>

<footer>
	<div class="container column page-block">
		<div id="social-media" class="container">
			<a href="https://twitter.com/silhouettesnft">
				<TwitterIcon />
			</a>
		</div>
		<div class="container">
			<p>© {year} Silhouettes Movie</p>
		</div>
	</div>
</footer>

<style global>
	input,
	label {
		border-bottom: 1px solid var(--main-blue);
		color: var(--main-blue);
	}
	label {
		width: 6em;
	}
	input:hover {
		border: 1px solid var(--main-blue);
	}
	.white {
		fill: white;
	}

	/* Fix the media-control element to take up the entire size of the player. */
	[data-player] .media-control[data-media-control] {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	#player {
		width: 100vw;
	}
	[data-player] video,
	[data-player] .container[data-container] {
		position: relative;
		display: block;
		width: 100%;
	}
	#sound-toggle,
	#video-overlay {
		z-index: 9999;
	}

	.wwwwwh {
		display: block;
		max-width: 1024px;
		margin: auto;
		padding: 4em;
		line-height: 1.5em;
	}

	.wwwwwh h2 {
		margin-top: 2em;
	}
	.wwwwwh h3 {
		margin-top: 2em;
	}
</style>
