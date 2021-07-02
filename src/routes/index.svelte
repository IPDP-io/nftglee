<script>
	import Form from '../components/form.svelte';
</script>

<div class="flex">
	<div class="text-white bg-black w-full flex flex-wrap lg:flex-nowrap border-b-8 border-secondary">
		<div class="xl:ml-72 py-24 w-2/3 flex-grow px-12">
			<p class="text-4xl">
				<b>Silhouettes The Movie</b>
			</p>
			<div class="text-2xl text-gray-200">
				<p class="mb-4">
					<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. The industry’s
					standard dummy text.
				</p>

				<a
          href="/view"
					class="text-center block rounded-xl w-72 mt-14 bg-primary text-white p-4 text-xl"
					>Watch now</a
				>
			</div>
		</div>
		<img
			class="hidden lg:block ml-auto w-full lg:w-auto lg:object-cover mottled"
			src="/static/mottled.jpg"
			alt="Mottled gray texture"
		/>
	</div>
</div>

<div class="flex flex-wrap py-20 px-12">
	<div class="text-black w-full flex">
		<h1 class="text-4xl mx-auto mb-12">Get in touch</h1>
	</div>
	<div class="flex mx-auto rounded-lg">
		<div class="mr-4">
			<Form />
		</div>
	</div>
</div>

<style>
	p {
		@apply mb-4;
	}

	.mottled {
		border-radius: 0 0 0 300px;
	}
</style>
