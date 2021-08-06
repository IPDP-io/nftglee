<script>
	import { received, unit } from '$lib/stores';
	import { session } from '$app/stores';
	import { btc, go } from '$lib/utils';

	let words;
</script>

<div class="container">
  Received {btc($received)}
  {$unit}!
</div>

<h2 class="container" style="margin: 2em 0">Write this down and keep it a secret!</h2>

{#if $session.user.mnemonic}
  <!--
	<div class="container">
		{#each $session.user.mnemonic.split(' ') as word, i}
			<div class="container" style="margin: 2em 1em; whitespace: nowrap">
        {i+1}. {word}
			</div>
		{/each}
	</div>
  -->

	<div class="container" style="margin: 2em 0">
		{#each [0, 1, 2] as i}
			<div style="margin: 0 2em">
				{#each [0, 1, 2, 3] as j}
					<div class="container" style="margin: 0.5em 0; display: block">
            {(j + 4*i) + 1}.
						{$session.user.mnemonic.split(" ")[j + 4*i]}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="container mb">
		<button on:click={() => go('/verify')}>I wrote it down</button>
	</div>
{/if}

<style>
	.mnemonic {
		word-spacing: 1.5em;
	}
</style>
