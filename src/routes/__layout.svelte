<script>
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import LinkedInIcon from '$icons/linkedin.svelte';
	import Form from '$components/form.svelte';
	import { goto } from '$app/navigation';

	import '../app.css';
	

	const year = new Date().getFullYear();
	onMount(async () => {
		const movieBanner = document.getElementById('movie-banner');
		const introVideo = document.getElementById('intro-video');
		movieBanner.addEventListener('click', () => {
			introVideo.muted = !introVideo.muted;
			document.querySelectorAll('.sound-icon').forEach((icon) => icon.classList.toggle('hidden'));
		});
	});

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
