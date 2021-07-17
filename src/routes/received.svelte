<script>
  import { received, unit } from "$lib/stores";
  let to;
  let send;
  let btc = () => {};
  let asset;
</script>

	<p>
		Received {btc($received)}
		{$unit}!
	</p>

  <div class="container">
		<h2>Your ticket</h2>
  </div>

	<div class="container">
		<div
			color="mb"
			style="border: 1px dashed black; width: 600px; margin: 0 auto; padding: 20px; text-align: left;"
		>
			<div><b>Type:</b> Tier 1 (#57 of 100)</div>
			{#if asset}
				<div>
					<b>Asset ID:</b>
					<a href={`http://localhost:5005/asset/${asset}`}>{asset.substr(0, 20)}....</a>
				</div>
			{/if}
			<div><b>Time purchased:</b> 2:03pm July 16, 2021</div>
		</div>
	</div>

	<div style="width: 600px; margin: 0 auto;" class="container mb">
		<video
			style="width: 100%; object-fit: cover"
			muted
			playsinline
			autoplay
			loop
			type="application/x-mpegURL"
		>
			<source src={'/static/ticket.mp4'} />
			Your browser does not support HTML5 video.
		</video>
	</div>

	<div class="container">
		<h2>Extra NFT goodies</h2>

		<div style="width: 600px; margin: 0 auto;">
			<video style="width: 100%; object-fit: cover" muted playsinline autoplay loop>
				<source src={'/static/girl.mp4'} />
				Your browser does not support HTML5 video.
			</video>
		</div>
	</div>

	<div class="container">
		<h2>Withdraw to Liquid Address</h2>
		<div>
			<input bind:value={to} style="width: 500px" />
		</div>
		<button on:click={send}>Withdraw</button>
	</div>
