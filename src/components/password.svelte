<script>
	import Eye from '../icons/eye.svelte';
  export let password;
  export let placeholder = 'Password';

	let show;
</script>

	<div class="form-field">
		<div>
			<div id="password" class="container">
				{#if show}
					<input
						id="password-input"
						bind:value={password}
						placeholder={placeholder}
						autocapitalize="off"
						class="grow"
					/>
				{:else}
					<input
						id="password-input"
						type="password"
						placeholder={placeholder}
						bind:value={password}
						autocapitalize="off"
						class="grow"
					/>
				{/if}
				<div
					id="show-password"
					on:click|preventDefault|stopPropagation={() => (show = !show)}
					style="height: 100%"
				>
					<Eye size={'100%'} />
				</div>
			</div>
		</div>
	</div>
