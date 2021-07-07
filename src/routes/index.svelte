<script>
	import Form from '../components/form.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<div id="movie-banner" class="container">
		<div id="video-overlay">
			<svg id="scroll-down-arrow" preserveAspectRatio="none" viewBox="20 20 160 160" xmlns="http://www.w3.org/2000/svg" data-type="shape" role="presentation" aria-hidden="true">
				<g>
					<path d="M180 100c0-44.184-35.817-80-80.001-80C55.817 20 20 55.817 20 100s35.817 80 79.999 80S180 144.183 180 100zm-87.148 30.82l-31.79-31.792a10.075 10.075 0 0 1-2.961-7.148c0-2.587.987-5.174 2.961-7.148 3.948-3.948 10.348-3.948 14.296 0L100 109.374l24.642-24.641c3.948-3.948 10.348-3.948 14.297 0 3.948 3.948 3.948 10.348 0 14.296l-31.79 31.791c-3.948 3.947-10.349 3.947-14.297 0z"></path>
				</g>
			</svg>
			<p>Scroll to begin</p>
		</div>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video id="intro-video"autoplay muted>
			<source src="/silhouettes.mp4" type="video/mp4" />
		</video> 
	</div>
	<div id="watch-silhouettes" class="container column">
		<div class="container">
			<h1>
				Watch Silhouettes
			</h1>
		</div>
		<div id="payment-options" class="container">
			<div class="container column">
				<h3>Choose preferred payment option:</h3>
				<div id="payment-buttons" class="container space-around">
					<button>Litecoin</button>
					<button>Liquid BTC</button>
				</div>
			</div>
			
		</div>
	</div>
	<div id="lets-chat" class="container column">
		<div class="container">
			<h2>Let's chat</h2>
			
		</div>
		<div class="container">
			<Form />
		</div>
	</div>
</section>

<style>
	section {
		color: var(--main-blue);
	}
	
	#movie-banner {
		align-items: flex-end;
		position: relative;
	}
	#video-overlay {
		display: inline-block;
		text-align: center;
		position: absolute;
		width: 20%;
		padding-bottom: 2%;
	}
	#video-overlay p {
		margin: 0;
		text-transform: uppercase;
		font-size: 35px;
		font-size: 3vw;
	}
	#scroll-down-arrow {
		width:25%;
		height: auto;
	}
	#scroll-down-arrow path {
		fill: var(--main-blue);
	}
	#intro-video {
		width: 100%;
	}
	#payment-options {
		margin-bottom: 2rem;
	}
	#lets-chat {
		font-family: "Oswald", sans-serif;
		background-color: var(--main-blue);
		color: white;
		padding-bottom: 2rem;
	}
	
	button {
		background-color: transparent;
		border: 5px solid var(--main-blue);
		width: 40%;
		height: 40px;
		color: var(--mainblue);
		transition: .6s;
	}
	button:hover {
		background-color: var(--main-blue);
		color: white;
		transition: .6s;
	}
</style>

