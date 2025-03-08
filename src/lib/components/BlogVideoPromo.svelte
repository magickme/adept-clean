<script lang="ts">
    type Props = {
        readonly title: string;
        readonly subtitle: string;
        readonly videoUrl: string;
        readonly dataTestid: string;
        readonly ctaText: string;
        readonly ctaLink: string;
    }

    // Constants
    const OBSERVER_THRESHOLD = 0.5;
    const OBSERVER_ROOT_MARGIN = '0px';

    const props = $props();

    // Types with better organization
    interface VideoControls {
        readonly play: () => Promise<void>;
        readonly pause: () => void;
        readonly toggleMute: () => void;
    }

    interface ObserverOptions {
        readonly threshold: number;
        readonly root: null;
        readonly rootMargin: string;
    }

    // State with explicit initialization
    let videoElement = $state<HTMLVideoElement | null>(null);
    let isIntersecting = $state(false);
    let isMuted = $state(true);

    // Derived state with better naming
    let isVideoPlayable = $derived(isIntersecting && videoElement !== null);
    let muteButtonLabel = $derived(isMuted ? "Unmute video" : "Mute video");
    let muteIcon = $derived(isMuted ? '🔇' : '🔊');

    // Add error types
    type VideoErrorBoundary = {
        readonly code: number;
        readonly message: string;
        readonly retry?: () => Promise<void>;
    };

    type VideoError = VideoErrorBoundary | null;

    // Update state
    let videoError = $state<VideoError>(null);

    // Add loading state type
    type LoadingState = {
        readonly isLoading: boolean;
        readonly progress?: number;
    };

    // Update state
    let loadingState = $state<LoadingState>({ isLoading: true });

    // Video controls with better error handling
    const videoControls: VideoControls = {
        async play() {
            if (!isVideoPlayable || videoError || loadingState.isLoading) return;
            try {
                await videoElement!.play();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    videoError = {
                        code: -1,
                        message: error.message || 'Unknown error'
                    };
                    console.error('Error playing video:', error);
                }
            }
        },

        pause() {
            if (!videoElement) return;
            videoElement.pause();
        },

        toggleMute() {
            if (!videoElement) return;
            videoElement.muted = !videoElement.muted;
            isMuted = videoElement.muted;
        }
    };

    // Navigation with better validation
    function handleCtaClick() {
        const link = props.ctaLink?.trim();
        if (!link) return;
        window.location.assign(link);
    }

    // Add initialization effect
    $effect.pre(() => {
        if (!videoElement) return;
        // Ensure video is properly initialized
        videoElement.load();
    });

    // Update intersection observer effect
    $effect(() => {
        if (!videoElement) return;

        const observerOptions: ObserverOptions = {
            threshold: OBSERVER_THRESHOLD,
            root: null,
            rootMargin: OBSERVER_ROOT_MARGIN
        };

        const handleIntersection = async ([entry]: IntersectionObserverEntry[]) => {
            if (!entry) return;
            isIntersecting = entry.isIntersecting;
            
            if (isIntersecting && !loadingState.isLoading && !videoError) {
                await videoControls.play();
            } else {
                videoControls.pause();
            }
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        observer.observe(videoElement);

        return () => {
            observer.disconnect();
            videoControls.pause();
            isIntersecting = false;
        };
    });

    // Improve error handling
    function handleVideoError(event: Event) {
        const target = event.target as HTMLVideoElement;
        const error = target.error;
        
        videoError = error ? {
            code: error.code,
            message: error.message || 'Unknown error'
        } : {
            code: -1,
            message: 'Unknown error occurred'
        };
    }

    // Add retry functionality
    async function retryVideo() {
        if (!videoElement) return;
        
        videoError = null;
        loadingState = { isLoading: true };
        
        try {
            videoElement.load();
            await videoElement.play();
        } catch (error) {
            handleVideoError(new ErrorEvent('error', { error }));
        }
    }

    // Update loading handler
    function handleLoadedMetadata() {
        loadingState = { isLoading: false };
    }
</script>

<div class="relative bg-kohl text-ivory py-12 sm:py-16" data-testid={props.dataTestid}>
    <div class="container mx-auto px-4 sm:px-6">
        <div class="flex flex-col md:flex-row items-center">
            <!-- Content Section -->
            <div class="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-cerulean-DEFAULT">
                    {props.title}
                </h1>
                <p class="text-lg sm:text-xl mb-6">
                    {props.subtitle}
                </p>
                <button 
                    onclick={handleCtaClick}
                    class="w-full sm:w-auto bg-cerulean-700 text-ivory py-3 px-6 rounded-full 
                           text-base sm:text-lg font-semibold hover:bg-cerulean-600 
                           transition duration-300 focus:outline-none 
                           focus:ring-2 focus:ring-cerulean-DEFAULT
                           active:bg-cerulean-700"
                    type="button"
                    aria-label={props.ctaText}
                >
                    {props.ctaText}
                </button>
            </div>

            <!-- Video Section -->
            {#if props.videoUrl}
                <div class="md:w-1/2 relative" aria-label="Video section">
                    <video
                        bind:this={videoElement}
                        class="w-full rounded-lg shadow-lg"
                        src={props.videoUrl.replace('/src/lib/assets/video/', 'https://video.adept.magick.me/videos/')}
                        loop
                        playsinline
                        muted={isMuted}
                        aria-label="Promotional video"
                        preload="metadata"
                        controlsList="nodownload"
                        disablePictureInPicture
                        onerror={handleVideoError}
                        onloadedmetadata={handleLoadedMetadata}
                    >
                        <track 
                            kind="captions" 
                            src="" 
                            label="English" 
                            srclang="en" 
                            default
                        />
                    </video>
                    <button
                        onclick={videoControls.toggleMute}
                        class="absolute bottom-4 right-4 bg-kohl/50 
                               text-ivory p-2 rounded-full hover:bg-kohl/70
                               transition-colors duration-200 focus:outline-none 
                               focus:ring-2 focus:ring-ivory/50
                               active:bg-kohl/80"
                        aria-label={muteButtonLabel}
                        type="button"
                    >
                        {muteIcon}
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

{#if videoError}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-kohl/50 rounded-lg">
        <p class="text-ivory text-center p-4">
            Unable to load video: {videoError.message}
        </p>
        <button
            onclick={retryVideo}
            class="mt-2 bg-cerulean text-ivory px-4 py-2 rounded-full
                   hover:bg-cerulean-600 transition-colors duration-200"
            type="button"
        >
            Retry
        </button>
    </div>
{/if}

{#if loadingState.isLoading && !videoError}
    <div class="absolute inset-0 flex items-center justify-center bg-kohl/30">
        <span class="text-ivory">Loading video...</span>
    </div>
{/if}