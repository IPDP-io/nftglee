<script>
	import { goto } from '$app/navigation';
	import { mnemonic, received, unit } from '$lib/stores';
	import { btc } from '$lib/utils';
	import { onMount } from 'svelte';
	import { createWallet, setup } from '$lib/wallet';

	let words;
	onMount(async () => {
		setup();
		$mnemonic = (await createWallet()).mnemonic;
	});
</script>

<div class="container">
	<p>
		Received {btc($received)}
		{$unit}!
	</p>
</div>

  <h2 class="container">Write this down and keep it a secret!</h2>

{#if $mnemonic}
	<!-- columns
	<div class="container">
		{#each [0, 1, 2] as i}
			<div style="margin: 0 20px">
				{#each [0, 1, 2, 3] as j}
					<div class="container">
            {(j + 4*i) + 1}.
						{words[j + 3 * i]}
					</div>
				{/each}
			</div>
		{/each}
	</div>
  -->

	<div class="container mb">
		{$mnemonic}
	</div>

	<div class="container mb">
		<button on:click={() => goto('/register', { noscroll: true })}>I wrote it down</button>
	</div>
{/if}

<svelte:head>
	<script src="/static/bip32.js"></script>
	<script src="/static/bip39.js"></script>
	<script src="/static/liquidjs.js"></script>
</svelte:head>
