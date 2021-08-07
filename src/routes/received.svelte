<script>
	import { received, unit } from '$lib/stores';
	import { session } from '$app/stores';
	import { btc, go } from '$lib/utils';

	let words;
</script>

<div class="container">
	Detected payment of {btc($received)}
	{$unit}!
</div>

{#if $session.user.mnemonic}
	<h3 class="container" style="margin: 1em 0">Write these words down and keep them a secret!</h3>

	<div class="container" style="margin: 1em 0">
		{#each [0, 1, 2] as i}
			<div style="margin: 0 2em">
				{#each [0, 1, 2, 3] as j}
					<div class="container" style="margin: 0.5em 0; display: block">
						{j + 4 * i + 1}.
						{$session.user.mnemonic.split(' ')[j + 4 * i]}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="container mb">
		<button on:click={() => go('/verify')}>I wrote them down</button>
	</div>
{/if}

<style>
	.mnemonic {
		word-spacing: 1.5em;
	}
</style>
