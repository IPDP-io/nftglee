<script>
	import { onMount } from 'svelte';
	import { api, auth } from '$lib/api';
	import Options from '$components/options.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { unit, ws } from '$lib/stores';
</script>

<Options />

<div class="container">
	<h3>Or..</h3>
</div>

<div class="container mb">
	<button on:click={() => goto('/login')}>I already have a ticket</button>
</div>
