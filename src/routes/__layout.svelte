<script>
	import '../app.css';
	import { session } from '$app/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import LinkedInIcon from '$icons/linkedin.svelte';
	import Form from '$components/form.svelte';
	import { goto } from '$app/navigation';

	const year = new Date().getFullYear();

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
			<div class="container">
        <h1 on:click={() => goto('/', { noscroll: true })}>Watch Silhouettes</h1>
			</div>

      <div style="min-height: 400px">
			<slot />
    </div>

			<div id="lets-chat" class="container column">
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
	<div class="container column">
		<div id="social-media" class="container">
			<FacebookIcon />
			<TwitterIcon />
			<LinkedInIcon />
		</div>
		<div class="container">
			<p>©{year} Silhouettes</p>
		</div>
	</div>
</footer>

<style global>
	#video-overlay {
		display: inline-block;
		text-align: center;
		position: absolute;
		width: 20%;
		padding-bottom: 2%;
	}
	#video-overlay p {
		margin: 0;
		text-transform: uppercase;
		font-size: 35px;
		font-size: 3vw;
	}
	#intro-video {
		width: 100%;
	}
  
	#lets-chat {
		font-family: 'Oswald', sans-serif;
		background-color: var(--main-blue);
		color: white;
		padding-bottom: 2rem;
	}

	section {
		color: var(--main-blue);
	}

	#movie-banner {
		align-items: flex-end;
		position: relative;
	}
	#sound-toggle {
		position: absolute;
		left: 15px;
		left: 1.5vh;
		top: 15px;
		top: 1.5vh;
	}
	.sound-icon {
		width: 1rem;
	}
	#payment-options {
		margin-bottom: 2rem;
	}

	button {
		cursor: pointer;
		background-color: transparent;
		border: 5px solid var(--main-blue);
		height: 40px;
		margin: 0 10px;
		font-size: 1rem;
		padding: 0 10px;
		color: var(--mainblue);
		transition: 0.6s;
	}
	button:hover,
	button.active {
		background-color: var(--main-blue);
		color: white;
		transition: 0.6s;
	}

	@media screen and (max-width: 1025px) {
		
	}
	@media screen and (max-width: 769px) {
		button {
			font-size: 15px;
			font-size: 2.25vw;
		}
	}
	@media screen and (max-width: 481px) {
		.sound-icon {
			width: 1rem;
		}
		button {
			font-size: 12px;
			font-size: 3.5vw;

		}
	}
	@media screen and (max-width: 320px) {
		.sound-icon {
	
		}
	}
	@media (orientation: landscape) {
		button {
			font-size: 2vw;
		}
		.sound-icon {
	
		}
	}
	@media (orientation: landscape) and (max-width: 769px) {
		.sound-icon {
		
		}
	}

	.qr {
		margin: auto;
		width: 300px;
	}

	.mb {
		margin-bottom: 10px;
	}
</style>
