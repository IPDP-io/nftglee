<script>
	import '../app.css';
	import '@fortawesome/fontawesome-free/js/all.min';
	import { session } from '$app/stores';
	import Down from '$icons/down.svelte';
	import Form from '$components/form.svelte';

	const year = new Date().getFullYear();
</script>

<main>
	<section>
		<div id="movie-banner" class="container">
			<div id="sound-toggle">
				<i class="fas fa-volume-mute fa-2x sound-icon" />
				<i class="fas fa-volume-up fa-2x sound-icon hidden" />
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
				<h1>Watch Silhouettes</h1>
			</div>

			<slot />

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
			<i class="fab fa-facebook-f social-icons" />
			<i class="fab fa-twitter social-icons" />
			<i class="fab fa-linkedin-in social-icons" />
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
		font-size: 0.8rem;
		font-size: 1vw;
		position: absolute;
		left: 15px;
		left: 1.5vh;
		top: 15px;
		top: 1.5vh;
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
		font-size: 24px;
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
		#sound-toggle {
			font-size: 0.7rem;
			font-size: 1.5vw;
		}
	}
	@media screen and (max-width: 769px) {
		#sound-toggle {
			font-size: 0.6rem;
			font-size: 1.5vw;
		}
		button {
			font-size: 15px;
			font-size: 2.25vw;
		}
	}
	@media screen and (max-width: 481px) {
		#sound-toggle {
			font-size: 0.5rem;
			font-size: 1.75vw;
		}
		button {
			font-size: 12px;
			font-size: 1.5vh;
		}
	}
	@media screen and (max-width: 320px) {
		#sound-toggle {
			font-size: 3vw;
		}
	}
	@media (orientation: landscape) {
		button {
			height: 4vw;
			font-size: 2vw;
		}
		#sound-toggle {
			font-size: 1vw;
		}
	}
	@media (orientation: landscape) and (max-width: 769px) {
		#sound-toggle {
			font-size: 1.5vw;
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
