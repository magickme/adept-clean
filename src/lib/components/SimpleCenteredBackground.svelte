<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import MagickMeLogo from '$lib/assets/logos/magickme_title_ivory.svg';
	import { tick } from 'svelte';

	// Use primitive values for state to reduce proxy overhead
	let supportWebp = $state(false);
	let isLoading = $state(true);
	let hasError = $state(false);
	let isPlaying = $state(false);
	let isVideoVisible = $state(false);
	
	// Lazy initialize expensive objects
	let videoElement: HTMLVideoElement;
	let observer: IntersectionObserver | null = null;

	// Memoize props to avoid re-renders
	const { 
		backgroundVideo = '',
		title = 'The Adept Initiative I & II',
		description = 'Free Yourself Spiritually. Free Yourself Materially.',
		announcement = 'LIMITED TIME OFFER',
		startDate = 'January 6, 2025',
		linkOneText = 'Enroll Now',
		linkOneUrl = '/enroll',
		linkTwoText = 'Watch Preview',
		linkTwoUrl = '/preview',
		id = '',
		class: className = ''
	} = $props();

	// Defer WebP check to idle time
	const checkWebpSupport = async () => {
		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(() => {
				const canvas = document.createElement('canvas');
				if (canvas.getContext && canvas.getContext('2d')) {
					supportWebp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
				}
			});
		} else {
			// Fallback for browsers without requestIdleCallback
			setTimeout(() => {
				const canvas = document.createElement('canvas');
				if (canvas.getContext && canvas.getContext('2d')) {
					supportWebp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
				}
			}, 0);
		}
	};

	// Optimize URL transformation
	const getR2Url = (url: string): string => {
		if (!url) return '';
		return `https://pub-d1204a6a488440efbe4cd01dd5f68840.r2.dev/${url}`;
	};

	// Initialize video playback with optimized handlers
	const initVideoPlayback = async () => {
		if (!videoElement) return;

		videoElement.playbackRate = 0.5;

		const handleCanPlay = () => {
			requestAnimationFrame(() => {
				isLoading = false;
				isPlaying = true;
			});
		};

		const handleLoadStart = () => {
			if (videoElement.readyState >= 3) {
				handleCanPlay();
			}
		};

		const handleError = (e: Event) => {
			console.error('Video error:', e);
			hasError = true;
			isLoading = false;
		};

		await tick();
		videoElement.addEventListener('loadstart', handleLoadStart);
		videoElement.addEventListener('canplay', handleCanPlay);
		videoElement.addEventListener('error', handleError);

		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVideoVisible = true;
					// Only start loading video when visible
					videoElement.src = getR2Url('evolve1_small.webm');
					videoElement.load();
					videoElement.play().catch(console.error);
					observer?.disconnect();
				}
			},
			{ 
				threshold: 0.1, 
				rootMargin: '50px',
			}
		);
		
		observer.observe(videoElement);

		return () => {
			if (videoElement) {
				videoElement.removeEventListener('loadstart', handleLoadStart);
				videoElement.removeEventListener('canplay', handleCanPlay);
				videoElement.removeEventListener('error', handleError);
				videoElement.src = '';
			}
			observer?.disconnect();
		};
	};

	onMount(async () => {
		await checkWebpSupport();
		await initVideoPlayback();
	});
</script>

<svelte:head>
	{#if !isPlaying}
		<link 
			rel="preload" 
			as="fetch" 
			href="https://pub-d1204a6a488440efbe4cd01dd5f68840.r2.dev/evolve1_small.webm"
			type="video/webm"
			fetchpriority="high"
			crossorigin="anonymous"
		>
	{/if}
</svelte:head>

<div 
	class="hero-container {className}" 
	{id}
	transition:fade
>
	<div class="video-background">
		{#if isLoading && !isPlaying}
			<div class="loading-overlay">
				<div class="loading-spinner"></div>
			</div>
		{/if}
		
		<video
			bind:this={videoElement}
			autoplay
			loop
			muted
			playsinline
			preload="none"
			class="video-element"
			poster={`/video-poster.${supportWebp ? 'webp' : 'jpg'}`}
			data-loading="eager"
			data-decoding="async"
			data-fetchpriority="high"
			crossorigin="anonymous"
		>
		</video>

		<div class="video-overlay"></div>

		{#if hasError}
			<div class="error-overlay"></div>
		{/if}
	</div>

	<div class="content-wrapper">
		<div class="content-backdrop" role="region" aria-label="Course Information">
			<a href="#pricing" class="offer-badge">
				<span class="lightning" aria-hidden="true">⚡</span> {announcement}
			</a>

			<div class="brand">
				<img 
					src={MagickMeLogo} 
					alt="Magick.Me" 
					class="w-full max-w-[300px] mx-auto mb-8"
					width="300"
					height="60" 
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</div>
			
			<h2 class="program-title" id="program-title">{title}</h2>
			
			<div class="value-prop">
				<p>{description}</p>
			</div>

			<div class="dates">
				<p><strong>{startDate}</strong></p>
			</div>

			<!-- <div class="pricing-section" aria-labelledby="savings-title">
				<h3 id="savings-title" class="savings">Save $150–$450</h3>
				<div class="sale-info">
					<h4>PRE-SALE NOW LIVE</h4>
					<p class="highlight">Cyber Monday Week Only!</p>
				</div>
			</div> -->

			<div class="cta-group" role="group" aria-label="Enrollment Options">
				<a href={linkOneUrl} class="primary-cta">{linkOneText}</a>
				<a href={linkTwoUrl} class="secondary-cta">
					{linkTwoText} 
					<span class="sr-only">Opens in current tab</span>
					<span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.hero-container {
		@apply relative min-h-[90vh] w-full flex items-center justify-center px-2 sm:px-4 py-8 sm:py-16 overflow-hidden;
		contain: content;
		content-visibility: auto;
	}

	.video-background {
		@apply absolute inset-0 -z-10;
		contain: strict;
		will-change: transform;
	}

	.video-element {
		@apply h-full w-full object-cover object-center opacity-60;
		transform: translateZ(0);
		backface-visibility: hidden;
		will-change: transform, opacity;
		contain: strict;
		transition: opacity 0.3s ease;
	}

	.video-overlay {
		@apply absolute inset-0;
		background: linear-gradient(
			135deg,
			rgba(0, 163, 220, 0.85) 0%,
			rgba(23, 90, 115, 0.75) 50%,
			rgba(0, 163, 220, 0.85) 100%
		);
		mix-blend-mode: color-burn;
		contain: strict;
		will-change: opacity;
	}

	.loading-overlay {
		@apply absolute inset-0 bg-black/70 flex items-center justify-center;
		contain: strict;
	}

	.loading-spinner {
		@apply animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A3DC];
		contain: strict;
		will-change: transform;
	}

	.error-overlay {
		@apply absolute inset-0 bg-black/70;
	}

	.content-wrapper {
		@apply relative z-10 w-full max-w-[90%] sm:max-w-3xl mx-auto;
		contain: layout style;
	}

	.content-backdrop {
		@apply text-center space-y-6 sm:space-y-8 p-6 sm:p-10 rounded-2xl font-montserrat;
		background: linear-gradient(
			135deg,
			rgba(7, 4, 2, 0.95) 0%,
			rgba(7, 4, 2, 0.85) 100%
		);
		backdrop-filter: blur(12px);
		box-shadow: 0 4px 40px rgba(7, 4, 2, 0.4);
		contain: content;
		will-change: transform, opacity;
	}

	.offer-badge {
		@apply inline-block bg-cerulean text-ivory text-sm sm:text-cap font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full transform hover:scale-105 transition-transform duration-200;
		text-shadow: 0 1px 2px rgba(7, 4, 2, 0.2);
		margin: 1.5rem auto;
		transition: all 0.2s ease-out;
	}

	.offer-badge:hover {
		@apply bg-cerulean-600;
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 163, 220, 0.3);
	}

	.offer-badge:active {
		transform: translateY(0) scale(1);
	}

	.lightning {
		@apply mr-1;
	}

	.brand {
		@apply mb-8;
	}

	.program-title {
		@apply text-2xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 tracking-tight text-ivory font-montserrat font-bold;
		line-height: 1.1;
	}

	.value-prop {
		@apply text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 space-y-2 font-sourceSans text-ivory;
		line-height: 1.2;
	}

	.dates {
		@apply text-lg sm:text-h3 mb-8 font-sourceSans text-cerulean;
	}

	.pricing-section {
		@apply space-y-4 mb-8;
	}

	.savings {
		@apply text-h1 font-montserrat text-cerulean;
		background: linear-gradient(135deg, #00A3DC 0%, #175A73 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.sale-info {
		@apply space-y-2;
	}

	.sale-info h4 {
		@apply text-h3 text-ivory font-montserrat;
	}

	.highlight {
		@apply text-h4 text-ivory font-semibold font-montserrat;
	}

	.access-info {
		@apply space-y-2 mb-12;
	}

	.access-info p {
		@apply text-p text-ivory/80 font-sourceSans;
	}

	.cta-group {
		@apply flex flex-col sm:flex-row items-center justify-center gap-4;
	}

	.primary-cta {
		@apply bg-cerulean hover:bg-cerulean-600 text-ivory font-bold py-4 px-8 rounded-lg 
			   transition-all duration-200 transform hover:scale-105 shadow-lg font-montserrat text-lg sm:text-xl;
	}

	.secondary-cta {
		@apply text-ivory hover:text-cerulean font-semibold transition-colors duration-200 font-montserrat text-lg sm:text-xl;
	}

	@media (max-width: 640px) {
		.brand {
			@apply text-5xl mb-6;
		}
		
		.program-title {
			@apply text-2xl mb-4;
		}
		
		.value-prop {
			@apply text-xl mb-6;
		}
		
		.savings {
			@apply text-3xl;
		}

		.content-backdrop {
			@apply p-4;
		}

		.cta-group {
			@apply flex-col gap-3;
		}

		.primary-cta, .secondary-cta {
			@apply w-full text-center py-3 px-6;
		}

		.dates {
			@apply mb-8;
		}

		.pricing-section {
			@apply mb-6;
		}
	}

	/* Optimize animations */
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Reduce paint operations for reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.video-element {
			display: none;
		}
		.loading-spinner {
			animation: none;
		}
		.content-backdrop {
			backdrop-filter: none;
			background: rgba(7, 4, 2, 0.95);
		}
	}

	/* Layer compositing hints */
	@supports (contain: strict) {
		.hero-container {
			contain: layout style paint;
		}
	}
</style>
