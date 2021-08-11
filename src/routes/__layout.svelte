<script>
  import { fade } from "svelte/transition";
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import {
		amount,
		unit,
		address,
		full,
		error,
		mnemonic,
		initialized,
		player,
		ticket,
		token,
		ws
	} from '$lib/stores';
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

	let reset = () => {
		$amount = $unit = undefined;
		go('/');
	};

  let down = true;

	let trailer = () => {
		let { p2pml } = window;

		if (p2pml && p2pml.hlsjs.Engine.isSupported()) {
			var engine = new p2pml.hlsjs.Engine();

			$player = new Clappr.Player({
				parentId: '#player',
				source: '/trailer/playlist.m3u8',
				autoPlay: true,
				loop: true,
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
			try {
				let user = await api.auth(`Bearer ${t}`).url('/user').get().json();
				user.token = t;
				if (user.mnemonic) $session.user = user;
			} catch (e) {}
		}
	});

	const year = new Date().getFullYear();

	onMount(async () => {
    setTimeout(() => down = false, 8000);
		setupScrollFade();
		await getToken();
		trailer();
		socket();
		setup();
		if (!$session.user) {
			let user = window.localStorage.getItem('user');
			try {
				if (user) $session.user = JSON.parse(user);
				else $session.user = createWallet();
				window.localStorage.setItem('user', JSON.stringify($session.user));
			} catch {
				window.localStorage.removeItem('user');
			}

			if (!$session.user.email && window.localStorage.getItem('address')) go('/received');
		}
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
		if ($full) return;
		muted = !muted;
		muted ? $player.mute() : $player.unmute();
	};

	$: clear($page);
	let clear = () => err(undefined);
	let scrollDown = () => {
		animateScroll.scrollTo({ element: '#watch-silhouettes', duration: 800 });
	};

	let released =
		new Date() >= new Date(Date.UTC(2021, 7, 13, 7, 0, 0)) ||
		($session.user && $session.user.email && $session.user.email.includes('coinos.io'));
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
			{#if $full}
				{#if !released}
					<div id="ticket-warning">
						Silhouettes is not available for viewing yet. The film will be released on Friday the
						13th at 00:00am PT
					</div>
				{:else if !$ticket}
					<div id="ticket-warning">Ticket not found, deposit a ticket to continue watching</div>
				{/if}
			{/if}
      {#if down}
			<div
        out:fade
				id="video-overlay"
				on:click|preventDefault|stopPropagation={scrollDown}
				style="cursor: pointer"
			>
				<Down />
			</div>
    {/if}
			<div id="player" />
		</div>

		<div id="watch-silhouettes" class="container column">
			<div class="page-block">
				<div class="container page-block" style="padding-top: 0">
					<img
						id="logo"
						src="silhouettes.png"
						on:click={reset}
						alt="Silhouettes"
						style="max-width: 80%"
					/>
				</div>

				{#if $initialized}
					{#if $error}
						<div class="container" style="color: red">{$error}</div>
					{/if}

					{#if $session.user.email}
						<div class="page-block">
							<div class="container">
								Signed in as {$session.user.email}
							</div>

							{#if $page.path !== '/watch'}
								<div class="container">
									<button on:click={() => go('/watch')}>Account Home</button>
								</div>
							{/if}
						</div>
					{/if}

					<slot />

					<div class="page-block">
						<Contact />
					</div>

					<div class="page-block">
						<About />
					</div>
				{/if}
			</div>
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
	@import '../app.css';

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
	#ticket-warning,
	#sound-toggle,
	#video-overlay {
		z-index: 9999;
	}

	#ticket-warning {
		background: white;
		opacity: 0.85;
		padding: 2em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.hide {
		display: none;
	}
	.hidden {
		visibility: hidden;
	}
</style>
