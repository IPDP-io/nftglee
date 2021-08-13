<script>
	import { onMount } from 'svelte';
	import { api, auth } from '$lib/api';
	import Options from '$components/options.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { loading, unit, ws } from '$lib/stores';
	import PendingIcon from '$icons/pending.svelte';
</script>

{#if $loading}
	<div id="loading" class="container column">
		<div class="container">
			<h3>Loading</h3>
		</div>
		<div class="container">
			<PendingIcon size="medium" />
		</div>
	</div>
{:else}
	<Options />

	<h4 class="container mb">Or..</h4>

	<div class="container">
		<button on:click={() => goto('/login')}>I already have a ticket</button>
	</div>
{/if}
