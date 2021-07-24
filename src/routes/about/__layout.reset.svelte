<script>
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import { error } from '$lib/stores';
	import Down from '$icons/down.svelte';
	import VolumeIconUp from '$icons/volume-up.svelte';
	import VolumeIconMute from '$icons/volume-mute.svelte';
	import FacebookIcon from '$icons/facebook.svelte';
	import TwitterIcon from '$icons/twitter.svelte';
	import LinkedInIcon from '$icons/linkedin.svelte';
	import Form from '$components/form.svelte';
	import { goto } from '$app/navigation';

  import '../../app.css';

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
		<div id="watch-silhouettes" class="container column">
			{#if $error}
				<div class="container" style="color: red">{$error}</div>
			{/if}

			{#if $session.user}
				<div class="container">
					{$session.user.email}
				</div>
			{/if}

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
