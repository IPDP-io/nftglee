<script>
  let to;
  let send;
  let btc = (amt) => amt;
  let received = .0002, unit = 'BTC', asset;
  let movieTitle = "Silhouettes";
  const fullDateOptions = { dateStyle: 'long', timeStyle: 'short' };
  const shortDateOptions = { dateStyle: 'short', timeStyle: 'short' };
  let date = new Date().toLocaleString('en-US', fullDateOptions);
  let shortDate = new Date().toLocaleString('en-US', shortDateOptions);

</script>

	<div class="container">
		<p>
			Received {btc(received)}
			{unit}!
		</p>
	</div>

	<div class="container">
		<!-- <h3>Your ticket</h3> -->
		<div class="container ticket">
			<div class="container column ticket-left grow">
				<div class="container ticket-details">
					<div class="ticket-prop">
						Title:
					</div>
					<div class="ticket-value grow">
						{movieTitle}
					</div>
					<div class="ticket-type ticket-value">
						Early bird (57/100)
					</div>
				</div>
				{#if asset}
					<div>
						Asset ID:
						<a href={`http://localhost:5005/asset/${asset}`}>{asset.substr(0, 20)}....</a>
					</div>
				{/if}
				<div class="container">
					<div class="ticket-prop">
						Date:
					</div>
					<div class="ticket-value grow">
						{date}
					</div>
				</div>
			</div>
			<div class="container column ticket-stub">
				<div>
					{movieTitle}
				</div>
				<div class="ticket-value">
					{shortDate}
				</div>
			</div>
			<div id="ticket-overlay" class="overlay">
				Admit one
			</div>
			<div id="stub-overlay" class="overlay">
				1
			</div>
		</div>
		
	</div>

	

	<div class="container column goodie">
		<h3>NFT Goodies</h3>
		<video
			class="goodie-video"
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

	
	<div class="container column goodie">
		<h3>Extra NFT goodies</h3>
		<video
			class="goodie-video"
			muted
			playsinline
			autoplay
			loop
			type="application/x-mpegURL"
		>
			<source src={'/static/girl.mp4'} />
			Your browser does not support HTML5 video.
		</video>
	</div>

	
	<div id="withdraw" class="container column">
		<h3>Withdraw to Liquid Address</h3>
		<form on:submit|preventDefault>
			<div id="withdraw-form" class="container">
				<div>
					Withdraw Address:
				</div>
				<div class="container grow">
					<div class="grow">
						<input class="withdraw" type="text" bind:value={to}>
					</div>
					<div>
						<button class="withdraw" on:click={send}>Withdraw</button>
					</div>
				</div>
			</div>
		</form>
	</div>

	<style>
		.ticket {
			border: .2em dashed white;
			width: 75%;
			height: calc(75vw * .3);
			position: relative;
			padding: 1em 2em;;
			background-color: #695a0f45;
			color: #00000085;
			font-size: 1.75vw;
			margin: 1.5em;
		}
		.ticket-left {
			justify-content: space-between;
		}
		.ticket-type {
			white-space: nowrap;
			padding: 0 1em;
		}
		.ticket-stub {
			border-left: .1em dashed #3c3c3c40;
			padding-left: 2em;
			text-align: center;
			justify-content: space-between;
		}
		.overlay {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			top: 50%;
			transform: translateY(-50%);
			font-size: 7em;
			color: #ffffff47;
			font-family: 'Abril Fatface';
		}
		#ticket-overlay {
			left: .3em;
			font-size: 5em;
			text-transform: uppercase;
			font-family: 'Zen Tokyo Zoo';
	
		}
		#stub-overlay {
			right: .5em;	
		}
		.ticket-left:before {
			content: '';
			position: absolute;
			display: block;
			height: 2em;
			width: 2em;
			left: -1em;
			top: -1em;
			border-radius: 50%;
			background-color: white;
		}
		.ticket-left:after {
			content: '';
			position: absolute;
			display: block;
			height: 2em;
			width: 2em;
			left: -1em;
			bottom: -1em;
			border-radius: 50%;
			background-color: white;
		}
		.ticket-stub:before {
			content: '';
			position: absolute;
			display: block;
			height: 2em;
			width: 2em;
			right: -1em;
			top: -1em;
			border-radius: 50%;
			background-color: white;
		}
		.ticket-stub:after {
			content: '';
			position: absolute;
			display: block;
			height: 2em;
			width: 2em;
			right: -1em;
			bottom: -1em;
			border-radius: 50%;
			background-color: white;
		}
		.ticket-prop {
			font-weight: 600;
			width: 4em;
		}
		.goodie {
			margin: 1.5rem;
			align-items: center;
		}
		.goodie-video {
			width: 75%;
		}
		#withdraw {
			align-items: center;
		}
		#withdraw-form {
			flex-wrap: wrap;
			align-items: center;
		}
		.withdraw {
			border: 2px solid var(--main-blue);
			height: 2rem;
			height: 5vh;
			margin: 1.5rem 0;
		}
		button.withdraw {
			transform: translateX(-1px);
			background-color: var(--main-blue);
			color: white;
		}
		button.withdraw:hover {
			background-color: var(--secondary-blue);
		}

		@media screen and (max-width: 769px) {
			.ticket {
				font-size: 2vw;
			}
			#ticket-overlay {
				font-size: 4em;
			}
		}
		@media screen and (max-width: 481px) {
			.ticket {
				font-size: 3vw;
			}
			#ticket-overlay {
			font-size: 2em;
			}
		}
		@media screen and (orientation: landscape) and (max-height: 600px) {
			.withdraw {
				height: 3vw;
			}
		}
		@media screen and (min-aspect-ratio: 3/4) and (max-aspect-ratio: 4/3) and (max-width: 769px) {
			.withdraw {
				height: 6vw;
			}
		}
	</style>
