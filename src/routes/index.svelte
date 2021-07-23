<script>
	import { onMount } from 'svelte';
	import { api, auth } from '$lib/api';
	import Options from '$components/options.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import socket from '$lib/socket';
	import { unit, ws } from '$lib/stores';

	let asset, txid;

	onMount(async () => {
		$ws = socket();
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
