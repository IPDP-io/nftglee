<script>
	import { onMount } from 'svelte';
	import { api, auth } from '$lib/api';
	import Options from '$components/options.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import socket from '$lib/socket';
  import { unit, ws } from "$lib/stores";

	const logout = async () => {
		try {
			let refresh_token = $session.user.token;

			await auth.url('/logout').query({ refresh_token }).post().res();

			$session.user = undefined;
		} catch (e) {
			console.log(e);
		}
	};

	let asset, txid;

	onMount(async () => {
		$ws = socket();
		const movieBanner = document.getElementById('movie-banner');
		const introVideo = document.getElementById('intro-video');
		movieBanner.addEventListener('click', () => {
			introVideo.muted = !introVideo.muted;
			document.querySelectorAll('.sound-icon').forEach((icon) => icon.classList.toggle('hidden'));
		});
	});

	let mint = () => {
		$ws.send(JSON.stringify({ type: 'mint' }));
	};

	let send = () => {
		$ws.send(JSON.stringify({ type: 'send', value: to, asset }));
	};
</script>

<Options />

<div class="container">
	<h3>Or..</h3>
</div>

<div class="container mb">
	<button on:click={() => goto('/login')}>I already have a ticket</button>
</div>

