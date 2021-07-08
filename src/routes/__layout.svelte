<script>
	import '../app.css';
	import '@fortawesome/fontawesome-free/js/all.min';
</script>

<main>
	<slot />
</main>

<footer>
	<div class="container column">
		<div id="social-media" class="container">
			<i class="fab fa-facebook-f social-icons"></i>
			<i class="fab fa-twitter social-icons"></i>
			<i class="fab fa-linkedin-in social-icons"></i>

		</div>
		<div class="container">
			<p>©2021 Silhouettes</p>
		</div>
	</div>
	
</footer>

<style>
	footer {
		font-family: Helvetica;
		font-size: 15px;
		font-size: 2vh;
		padding: 50px;
	}
	.social-icons {
		margin: 15px;
		font-size: 15px;
		font-size: 2vh;
	}
	@media (orientation: landscape) {
		footer {
			font-size: 1.5vw;
			padding: 1vw;
		}
		.social-icons {
			margin: 1vw;
			font-size: 1.5vw;
		}
	}
</style>