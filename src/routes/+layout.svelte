<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeApp } from '$lib/utils/appInit';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			initializeApp().catch(console.error);
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://i.pravatar.cc" crossorigin="anonymous" />
	<link rel="preconnect" href="https://cdn.plyr.io" crossorigin="anonymous" />
	<link rel="dns-prefetch" href="https://i.pravatar.cc" />
	<link rel="dns-prefetch" href="https://cdn.plyr.io" />
	
	<link rel="preload" href="/_app/immutable/assets/vendor.B9ZS6GW0.css" as="style" />
	<link rel="preload" href="/_app/immutable/assets/routes.BOl1pbVf.css" as="style" />
	<link rel="preload" href="/_app/immutable/assets/components.D1fwmxIS.css" as="style" />
</svelte:head>

<ParaglideJS {i18n}>
	<slot />
</ParaglideJS>
