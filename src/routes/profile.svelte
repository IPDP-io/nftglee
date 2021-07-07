<script>
	import { session } from '$app/stores';
	import { auth } from '$lib/api';
	import { goto } from '$app/navigation';

	const logout = async () => {
		try {
      let refresh_token = $session.user.token;

			await auth
				.url('/logout')
        .query({ refresh_token })
      //				.auth('Bearer ' + $session.user.token)
				.post()
      .res();

			$session.user = undefined;

			goto('/login');
		} catch (e) {
			console.log(e);
		}
	};
</script>

{#if $session.user}
	<div class="container">
		<p class="mb-4">
			Your email: {$session.user.email}
		</p>

		<div>
			<a
				on:click={logout}
				class="cursor-pointer rounded-xl bg-primary text-white py-2 px-6 md:text-lg whitespace-nowrap"
				>Sign out</a
			>
		</div>
	</div>
{/if}
