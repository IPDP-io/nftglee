<script>
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import { address, error, mnemonic, ws } from '$lib/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import Form from '$components/form.svelte';
	import { err, go } from '$lib/utils';
	import socket from '$lib/socket';
	import { createWallet, setup } from '$lib/wallet';

	import '../app.css';

	const year = new Date().getFullYear();
	onMount(async () => {
		$ws = socket();
		setup();
    if (!$mnemonic) await createWallet();
		const movieBanner = document.getElementById('movie-banner');
		const introVideo = document.getElementById('intro-video');
		movieBanner.addEventListener('click', () => {
			introVideo.muted = !introVideo.muted;
			document.querySelectorAll('.sound-icon').forEach((icon) => icon.classList.toggle('hidden'));
		});
	});

	$: clear($page);
	let clear = () => err(undefined);
</script>

<main>
	<section>
		<div id="movie-banner" class="container">
			<div id="sound-toggle">
				<VolumeIconUp />
				<VolumeIconMute />
			</div>
			<div id="video-overlay">
				<p>Scroll to begin</p>
				<Down />
			</div>
			<!-- svelte-ignore a11y-media-has-caption -->
			<video id="intro-video" autoplay muted>
				<source src="/silhouettes.mp4" type="video/mp4" />
			</video>
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
					{$session.user.email}
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
</style>
