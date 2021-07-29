<script>
	import { mnemonic, received, unit } from '$lib/stores';
	import { btc, go } from '$lib/utils';

	let words;
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
		<button on:click={() => go('/verify')}>I wrote it down</button>
	</div>
{/if}
