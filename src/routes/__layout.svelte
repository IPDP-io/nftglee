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
		console.log('token changed', t);
		if (t && !$session.user) {
			console.log('getting user');
			$session.user = await api.auth(`Bearer ${t}`).url('/user').get().json();
			console.log($session.user);
		}
	});

	const year = new Date().getFullYear();

	onMount(async () => {
		setupScrollFade();
		await getToken();
		trailer();
		socket();
		setup();
		if (!$mnemonic) await createWallet();
		$initialized = true;
	});

	function setupScrollFade() {
		const fadeElement = document.getElementById('movie-banner');
		let scrollFadeHeight = fadeElement.offsetHeight;
		console.log(scrollFadeHeight);
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
				<Down />
			</div>
			<div id="player">
				<!-- svelte-ignore a11y-media-has-caption -->
				<!--
				<video id="intro-video" autoplay muted>
					<source src="/trailer/playlist.m3u8" type="" />
				</video> 
				-->
			</div>
		</div>
		<div id="watch-silhouettes" class="container column">
			<div class="container page-block">
				<h1 on:click={() => go('/')}>Silhouettes</h1>
			</div>

			{#if $initialized}
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
				<div class="container wwwwwh">
					<h1 class="mb" style="line-height: 1em">THE “WHO, WHAT, WHEN, WHERE, WHY &amp; HOW”</h1>

					<h2 class="mb">WHO</h2>

					<h3>SAMSON MOW</h3>
					<p>
						Samson Mow is Blockstream’s CSO and Pixelmatic’s CEO. Blockstream is the leading
						provider of blockchain technologies, on the forefront of work in cryptography and
						distributed systems. Samson founded Pixelmatic in 2011 to create engaging games that are
						truly social and encourage new connections to be made.
					</p>

					<h3>MATT HARTLEY</h3>

					<p>
						Matt Hartley is a film director and producer; who has made numerous films and worked
						with studios to independent production companies. Matt is the Founder of ALBA Films, a
						new production company that produces content exclusively for the crypto space using
						blockchain technologies.
					</p>

					<h3>ADAM SOLTYS</h3>

					<p>
						CTO of coinos, an open source bitcoin web wallet and exchange platform, and creator of
						Raretoshi, an art marketplace for digital patronage that brings NFTs to Bitcoin and the
						Liquid Network.
					</p>

					<h3>SHIV RAJAGOPAL</h3>

					<p>
						Shiv Rajagopal is a producer and filmmaker From Hong Kong. Having worked in the films
						industry, he now resides in Hong Kong, working as a content writer. He is also a
						co-founder of ALBA.
					</p>

					<h2>WHAT</h2>

					<p>
						SILHOUETTES is a sci-fi feature film that is about astronaut Katherine Barnes, who is
						visited by an extraterrestrial, who takes her on a tour of the universe- past, present,
						and future. It will be the first feature film to be released through this state of the
						art streaming platform called ALBA. This will be the first of many future exclusive
						films and series that will be distributed through this platform. Based on their time of
						purchase, users will also be given tokenized assets and digital goodies along with
						access to the SILHOUETTES. These NFT’s will be released as part of three separate tiers.
					</p>

					<ul>
						<li>Tier 1 = First 100 buyers - 3 DIGITAL ASSETS/NFTs</li>
						<li>Tier 2 = Buyer 101 to 1,101 (1000 buyers) - 2 DIGITAL ASSETS/NFTs</li>
						<li>Tier 3 = 1102 user onwards - 1 DIGITAL ASSET/NFT</li>
					</ul>

					<h2>WHEN</h2>

					<p>SILHOUETTES will be released in early August 2021.</p>

					<h2>WHERE</h2>
					<p>
						SILHOUETTES can be accessed worldwide upon release. All you need is a digital wallet.
					</p>
					<h2>WHY</h2>
					<p>
						Consumption and creation of art has been booming with the recent NFT craze. While it
						does a great job empowering artists, it also presents a high barrier to entry with high
						costs and fees. Movies and TV series are an art form for the masses, and our goal is to
						price our content as such. Through tokenization, we want to change how content is
						experienced in the crypto space. It also brings us one step closer to
						hyperbitcoinization. With ALBA, We aim to be the Netflix for the BTC world.
					</p>

					<h2>HOW</h2>

					<p>
						We plan to roll out SILHOUETTES and many other future ventures through our state of the
						art platform - ALBA. You will be buying a token that represents a movie ticket to our
						film. Without a token, you won’t be able to experience the movie. You can buy the ticket
						using BTC, BTC Liquid, Lightning and Litecoin. The token comes with access to digital
						goodies and tokenized assets.
					</p>
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
  input,textarea {
    padding: 1.25em 1.75em;
  }

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
