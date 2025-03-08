<script lang="ts">
	import { onMount } from 'svelte';

	let videoRef = $state<HTMLVideoElement>();
	let player: any;

	onMount(async () => {
		const Plyr = (await import('plyr')).default;
		await import('plyr/dist/plyr.css');

		if (videoRef) {
			const options = {
				controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] as string[],
				hideControls: false,
				resetOnEnd: true,
				quality: {
					default: 1080,
					options: [1080]
				},
				previewThumbnails: { enabled: false }
			};
			
			player = new Plyr(videoRef, options);

			const video = videoRef;
			video.addEventListener('loadedmetadata', () => {
				video.currentTime = 0.1;
			});

			return () => {
				if (player) player.destroy();
			};
		}
	});

	const {
		title = 'Transform Your Life in 2025',
		subtitle = '',
		description = 'Join thousands of successful students who have already transformed their lives through our proven system.',
		postVideoDescription = '',
		videoUrl = '',
		features = []
	} = $props<{
		title?: string;
		subtitle?: string;
		description?: string;
		postVideoDescription?: string;
		videoUrl?: string;
		features?: Array<{
			title: string;
			description: string;
			icon: string;
		}>;
	}>();
</script>

<div class="bg-kohl py-16 sm:py-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-4xl sm:text-5xl font-bold tracking-tight text-ivory font-montserrat leading-tight">
				{@html title.replace(/\n/g, '<br>')}
			</h2>
			{#if subtitle}
				<p class="mt-6 text-xl sm:text-2xl text-cerulean font-montserrat leading-relaxed">
					{@html subtitle.replace(/\n/g, '<br>')}
				</p>
			{/if}
			<p class="mt-6 text-lg sm:text-xl text-ivory/80 font-sourceSans leading-relaxed">
				{@html description.replace(/\n/g, '<br>')}
			</p>
		</div>

		{#if videoUrl}
			<div class="mt-12 relative mx-auto max-w-4xl overflow-hidden rounded-xl bg-kohl/30">
				<video
					bind:this={videoRef}
					class="w-full plyr"
					playsinline
					preload="metadata"
					poster="https://pub-d1204a6a488440efbe4cd01dd5f68840.r2.dev/evolve1_poster.jpg"
				>
					<source src={videoUrl} type="video/mp4" />
					<track kind="captions" label="English" srclang="en" src="" default />
				</video>
			</div>
		{/if}

		{#if postVideoDescription}
			<div class="mx-auto max-w-2xl text-center mt-12">
				<p class="text-lg sm:text-xl text-flannel-DEFAULT font-sourceSans leading-relaxed">
					{@html postVideoDescription.replace(/\n/g, '<br>')}
				</p>
			</div>
		{/if}

		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
			<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
				<div class="flex flex-col items-start">
					<dt>
						<svg class="h-8 w-8 text-cerulean mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
						</svg>
						<div class="font-semibold text-ivory font-montserrat text-xl">The Adept Initiative I: Jan 6–Feb 14, 2025</div>
					</dt>
					<dd class="mt-2 leading-7 text-flannel-DEFAULT font-sourceSans text-lg">
						In the all-new, completely revamped version of the most comprehensive training in Magick & the Occult ever created, you'll master the foundational practices of magick, yoga, self-analysis and financial prosperity—everything you need to know to become a master of your own reality.
					</dd>
				</div>

				<div class="flex flex-col items-start">
					<dt>
						<svg class="h-8 w-8 text-cerulean mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="4" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16M4 12h16" />
						</svg>
						<div class="font-semibold text-ivory font-montserrat text-xl">The Adept Initiative II: Mar 16–Apr 25, 2025</div>
					</dt>
					<dd class="mt-2 leading-7 text-flannel-DEFAULT font-sourceSans text-lg">
						Then, in the long-awaited follow-up, you'll master the intricacies of ceremonial magick, Qabalah, divination, pathworking, working with deities & spirits, and lots more. Together as a class, we'll be exploring the <em>entire Tree of Life</em>, first hand—exploring every path and sephirah through in-depth astral excursions.
					</dd>
				</div>

				<div class="flex flex-col items-start">
					<dt>
						<svg class="h-8 w-8 text-cerulean mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div class="font-semibold text-ivory font-montserrat text-xl">Two Courses. Endless Options.</div>
					</dt>
					<dd class="mt-2 leading-7 text-flannel-DEFAULT font-sourceSans text-lg">
						Take either course separately or together as one step-by-step transformative process. Choose from a variety of pricing tiers and payment plans—there's an option for every budget. Plus, you can take advantage of significant discounts when you enroll in both courses together.
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>

<style>
	/* Improve mobile responsiveness */
	@media (max-width: 640px) {
		.grid-cols-1 {
			gap: 2rem;
		}

		dt {
			font-size: 1.25rem;
		}

		dd {
			font-size: 1rem;
		}
	}

	/* Add hover effects for cards */
	:global(.flex-col) {
		transition: all 0.3s ease-in-out;
		padding: 1.5rem;
		border-radius: 0.5rem;
	}

	:global(.flex-col:hover) {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px -2px rgba(0, 123, 167, 0.2);
		background-color: rgba(0, 123, 167, 0.05);
	}
</style>