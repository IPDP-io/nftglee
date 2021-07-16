<script>
	import { btc } from '$lib/utils';
  import { pending, unit } from "$lib/stores";
</script>

<div class="container">
	Payment detected

	{btc($pending)}
	{$unit} Pending
</div>
