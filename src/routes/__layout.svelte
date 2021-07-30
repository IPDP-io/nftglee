<script>
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import { address, error, mnemonic, initialized, player, token, ws } from '$lib/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import Form from '$components/form.svelte';
	import { err, go } from '$lib/utils';
	import socket from '$lib/socket';
	import { createWallet, setup } from '$lib/wallet';
	import { api } from '$lib/api';
	import { getToken } from '$lib/auth';

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
				// source: '/static/silhouettes.mp4',
				autoPlay: true,
				mute: true,
				hideMediaControl: true,
				chromeless: true,
				//controls: false,
				width: '100%',
				height: 'auto',
				playback: {
					hlsjsConfig: {
						liveSyncDurationCount: 7,
						loader: engine.createLoaderClass()
					}
				}
			});

			p2pml.hlsjs.initClapprPlayer($player);
		} else {
			setTimeout(loadVideo, 100);
		}
	};

	token.subscribe(async (t) => {
		console.log('token changed', t);
    if (t && !$session.user) {
      console.log('getting user');
			$session.user = await api.auth(`Bearer ${t}`).url('/user').get().json();
      console.log($session.user);
    } 
	});

	const year = new Date().getFullYear();
	onMount(async () => {
		await getToken();
		trailer();
		socket();
		setup();
		if (!$mnemonic) await createWallet();
    $initialized = true;
	});

	let muted = true;
	let toggle = () => {
		muted = !muted;
		muted ? player.mute() : player.unmute();
	};

	$: clear($page);
	let clear = () => err(undefined);
</script>

<main>
	<section>
		<div id="movie-banner" class="container" on:click={toggle}>
			<div id="sound-toggle">
				{#if muted}
					<VolumeIconMute />
				{:else}
					<VolumeIconUp />
				{/if}
			</div>
			<div id="video-overlay">
				<p>Scroll to begin</p>
				<Down />
			</div>
			<div id="player" />
			<!-- svelte-ignore a11y-media-has-caption -->
			<!--
			<video id="intro-video" autoplay muted>
        <source src="/trailer/playlist.m3u8" type="" />
			</video>
      -->
		</div>
		<div id="watch-silhouettes" class="container column">
			<div class="container page-block">
				<h1 on:click={() => go('/')}>Silhouettes</h1>
			</div>

			{#if $error}
				<div class="container" style="color: red">{$error}</div>
			{/if}

			{#if $session.user}
				<div class="container">
					Signed in as {$session.user.email}
				</div>
			{/if}

			<div style="min-height: 400px" class="page-block">
				<slot />
			</div>

			<div id="lets-chat" class="container column page-block">
				<div class="container">
					<h2>Let's chat</h2>
				</div>
				<div class="container">
					<Form />
				</div>
			</div>
		</div>
	</section>
</main>

<footer>
	<div class="container column page-block">
		<div id="social-media" class="container">
			<FacebookIcon />
			<TwitterIcon />
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
	input::placeholder {
		color: var(--main-blue);
	}
	input:hover {
		border: 1px solid var(--main-blue);
	}
	.white {
		fill: white;
	}

	/* Fix the player container to take up 100% width and to calculate its height based on its children. */
	[data-player] {
		position: relative;
		width: 100%;
		height: auto;
		margin: 0;
	}

	/* Fix the video container to take up 100% width and to calculate its height based on its children. */
	[data-player] .container[data-container] {
		width: 100%;
		height: auto;
		position: relative;
	}

	/* Fix the media-control element to take up the entire size of the player. */
	[data-player] .media-control[data-media-control] {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	/* Fix the video element to take up 100% width and to calculate its height based on its natural aspect ratio. */
	[data-player] video {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
	}

	#player {
		width: 100%;
	}
	#sound-toggle,
	#video-overlay {
		z-index: 9999;
	}
</style>
