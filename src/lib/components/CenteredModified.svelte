<script lang="ts">
	const props = $props<{
		title: string;
		subtitle: string;
		videoUrl?: string;
		dataTestid?: string;
	}>();

	let videoElement: HTMLVideoElement | null = $state(null);
	let isIntersecting = $state(false);
	let isMuted = $state(true);
	let observer: IntersectionObserver | null = $state(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);

	type IntersectionEntry = {
		isIntersecting: boolean;
		target: Element;
		boundingClientRect: DOMRectReadOnly;
		intersectionRatio: number;
		intersectionRect: DOMRectReadOnly;
		rootBounds: DOMRectReadOnly | null;
		time: number;
	};

	function setupIntersectionObserver(element: HTMLVideoElement) {
		const observer = new IntersectionObserver(
			(entries: IntersectionEntry[]) => {
				entries.forEach((entry) => {
					isIntersecting = entry.isIntersecting;
					if (isIntersecting) {
						element.play().catch(error => {
							console.error('Error playing video:', error);
						});
					} else {
						element.pause();
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);
		return observer;
	}

	function toggleMute() {
		if (!videoElement) return;
		videoElement.muted = !videoElement.muted;
		isMuted = videoElement.muted;
	}

	function togglePlay() {
		if (!videoElement) return;
		if (isPlaying) {
			videoElement.pause();
		} else {
			videoElement.play();
		}
		isPlaying = !isPlaying;
	}

	function handleSeek(e: Event) {
		if (!videoElement) return;
		const target = e.target as HTMLInputElement;
		const time = Number(target.value);
		videoElement.currentTime = time;
		currentTime = time;
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	$effect(() => {
		if (!videoElement) return;

		observer = setupIntersectionObserver(videoElement);
		
		// Setup video events using Svelte 5 syntax with null checks
		const video = videoElement;  // Create a stable reference
		video.ontimeupdate = () => {
			if (!video) return;
			currentTime = video.currentTime;
			duration = video.duration;
		};

		video.oninput = handleSeek;

		return () => {
			observer?.disconnect();
			if (video) {
				video.pause();
				video.src = '';
				video.ontimeupdate = null;
				video.oninput = null;
			}
		};
	});
</script>

<div
	class="relative isolate overflow-hidden bg-kohl px-6 py-12 sm:py-16"
	data-testid={props.dataTestid ?? 'centered-modified'}
>
	<div class="absolute inset-0 -z-10 overflow-hidden">
		<!-- SVG background code remains unchanged -->
	</div>

	<div class="mx-auto max-w-2xl flex flex-col items-center">
		<!-- <div class="text-center mb-8">
			<h1 class="text-h1 font-bold tracking-tight text-ivory">{props.title}</h1>
		</div> -->

		<div class="w-full mb-8 relative">
			{#if props.videoUrl}
				<div class="relative">
					<video
						bind:this={videoElement}
						class="w-full max-w-none rounded-xl bg-ivory/5 shadow-xl ring-1 ring-ivory/10"
						loop
						playsinline
						muted={isMuted}
						data-testid="video-element"
					>
						<source src={props.videoUrl} type="video/mp4" />
						<source src={props.videoUrl?.replace('.mp4', '.webm')} type="video/webm" />
						<track kind="captions" src="" label="English" srclang="en" />
					</video>
					
					<!-- Custom Video Controls -->
					<div class="absolute bottom-0 left-0 right-0 bg-black/50 p-4 flex items-center gap-4">
						<button
							onclick={togglePlay}
							class="text-ivory hover:text-cerulean"
							aria-label={isPlaying ? 'Pause' : 'Play'}
						>
							{isPlaying ? '⏸️' : '▶️'}
						</button>
						
						<div class="flex-1 flex items-center gap-2">
							<span class="text-ivory text-sm">{formatTime(currentTime)}</span>
							<input 
								type="range"
								min="0"
								max={duration}
								value={currentTime}
								oninput={handleSeek}
								class="flex-1 h-2 rounded-lg"
							/>
							<span class="text-ivory text-sm">{formatTime(duration)}</span>
						</div>

						<button
							onclick={toggleMute}
							class="text-ivory hover:text-cerulean"
							aria-label={isMuted ? 'Unmute' : 'Mute'}
						>
							{isMuted ? '🔇' : '🔊'}
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- <div class="text-left">
			<p class="mt-6 text-p font-sourceSans leading-8 text-ivory text-left space-y-4" data-testid="subtitle-text">{@html props.subtitle}</p>
		</div> -->
	</div>
</div>

<style>
	input[type="range"] {
		-webkit-appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 5px;
		height: 4px;
		outline: none;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-cerulean);
		cursor: pointer;
	}

	input[type="range"]::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-cerulean);
		cursor: pointer;
		border: none;
	}
</style>
