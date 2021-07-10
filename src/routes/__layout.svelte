<script>
	import '../app.css';
	import '@fortawesome/fontawesome-free/js/all.min';
	import { session } from '$app/stores';
	const year = new Date().getFullYear();
</script>

<main>
	<slot />
</main>

<footer>
	<div class="container column">
		<div id="social-media" class="container">
			<i class="fab fa-facebook-f social-icons" />
			<i class="fab fa-twitter social-icons" />
			<i class="fab fa-linkedin-in social-icons" />
		</div>
		<div class="container">
			<p>©{year} Silhouettes</p>
		</div>
	</div>
</footer>
