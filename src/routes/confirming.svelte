<script>
	import { btc } from '$lib/utils';
	import { pending, unit } from "$lib/stores";
	import PendingIcon from '$icons/pending.svelte';
	import About from './about.svelte';
</script>

<div class="container">
	<div id="payment-detected" class="container column">
		<h3>
			Payment detected
		</h3>
		<p>
			{btc($pending)}
			{$unit} Pending
		</p>
		<div>
			<PendingIcon />
		</div>
	</div>
	
</div>

<style>
	#payment-detected {
		text-align: center;
	}	
</style>

