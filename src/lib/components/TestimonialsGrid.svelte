<script lang="ts">
    import { scale } from 'svelte/transition';
    import { elasticOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import { getOptimizedAvatarUrl, getAvatarImageProps } from '$lib/utils/imageUtils';

    const { 
        testimonials, 
        head = "Testimonials", 
        subhead = "See what our students are saying",
        isLoading = false,
        error: errorProp = null
    } = $props<{
        testimonials: Array<{
            quote: string;
            author: string;
            title: string;
            avatar: string;
            company?: {
                name: string;
                logo: string;
            };
        }>;
        head?: string;
        subhead?: string;
        isLoading?: boolean;
        error?: string | null;
    }>();

    type Testimonial = typeof testimonials[number];

    let featuredTestimonial = $state<Testimonial | null>(null);
    let regularTestimonials = $state<Testimonial[]>([]);
    let error = $state<string | null>(null);

    const isValidTestimonial = (testimonial: unknown): testimonial is Testimonial => {
        if (!testimonial) return false;
        if (typeof testimonial !== 'object' || testimonial === null) return false;
        
        const test = testimonial as Record<string, unknown>;
        return (
            'quote' in test &&
            'author' in test &&
            'title' in test &&
            'avatar' in test
        );
    };

    type ErrorType = 'array' | 'noData' | 'unknown' | 'custom';
    const ERROR_MESSAGES: Record<ErrorType, string> = {
        array: 'Unable to load testimonials at this time',
        noData: 'No testimonials are available at this time',
        unknown: 'An error occurred while loading testimonials',
        custom: ''  // Will be replaced with actual error message
    };

    const getErrorMessage = (err: Error): string => {
        // If it's a direct error prop, return it as is
        if (err.message === errorProp) {
            return 'Unable to load testimonials at this time';
        }

        switch (err.message) {
            case 'Testimonials must be an array':
                return ERROR_MESSAGES.array;
            case 'No valid testimonial data':
                return ERROR_MESSAGES.noData;
            default:
                return ERROR_MESSAGES.unknown;
        }
    };

    $effect(() => {
        if (errorProp) {
            error = 'Unable to load testimonials at this time';
            return;
        }

        if (isLoading) {
            error = null;
            return;
        }

        try {
            error = null;
            if (!Array.isArray(testimonials)) {
                throw new Error('Testimonials must be an array');
            }
            
            if (testimonials.length > 0) {
                const validTestimonials = testimonials.filter(isValidTestimonial);
                
                if (validTestimonials.length === 0) {
                    throw new Error('No valid testimonial data');
                }
                
                featuredTestimonial = validTestimonials[0];
                regularTestimonials = validTestimonials.slice(1);
            } else {
                featuredTestimonial = null;
                regularTestimonials = [];
            }
        } catch (err) {
            console.error('Error in testimonials effect:', err);
            error = err instanceof Error ? getErrorMessage(err) : ERROR_MESSAGES.unknown;
            featuredTestimonial = null;
            regularTestimonials = [];
        }
    });

    const avatarProps = getAvatarImageProps();
</script>

<style>
    @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0); }
    }

    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); }
        100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
    }

    .featured-testimonial {
        animation: glow 4s ease-in-out infinite;
    }
</style>

<div class="relative isolate pb-32 pt-24 sm:pt-32 bg-kohl text-ivory" data-testid="testimonials-grid">
    <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
        <div class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-cerulean to-corsair" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end" aria-hidden="true">
        <div class="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-cerulean to-corsair xl:ml-0 xl:mr-[calc(50%-12rem)]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-base/7 font-semibold text-flannel font-sourceSans">{head}</h2>
            <p class="mt-2 text-balance text-4xl font-semibold tracking-tight text-ivory sm:text-5xl font-montserrat">{subhead}</p>
        </div>
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-6 text-sm/6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
            {#if isLoading}
                <div class="animate-pulse col-span-2 sm:col-span-2 xl:col-start-2 xl:row-end-1" 
                     role="status"
                     aria-live="polite" 
                     aria-busy="true"
                     data-testid="loading-skeleton">
                    <div class="h-48 bg-flannel/20 rounded-2xl"></div>
                </div>
                {#each Array(3) as _}
                    <div class="animate-pulse">
                        <div class="h-32 bg-flannel/20 rounded-2xl"></div>
                    </div>
                {/each}
            {:else if error}
                <div class="col-span-full text-center text-flannel font-sourceSans" 
                     role="alert" 
                     aria-live="assertive">
                    <p>{error}</p>
                </div>
            {:else}
                {#if featuredTestimonial}
                    {#each [featuredTestimonial] as testimonial (testimonial.author)}
                        <figure 
                            class="featured-testimonial rounded-2xl bg-ivory/90 shadow-lg ring-1 ring-flannel/20 sm:col-span-2 xl:col-start-2 xl:row-end-1"
                            transition:scale|local={{ duration: 600, delay: 200, easing: elasticOut }}
                            animate:flip={{ duration: 400 }}
                        >
                            <blockquote class="p-6 text-lg font-semibold tracking-tight text-kohl/90 sm:p-8 sm:text-xl/8 font-montserrat">
                                <p>"{testimonial.quote}"</p>
                            </blockquote>
                            <figcaption class="flex items-center gap-x-4 border-t border-flannel/20 px-6 py-4">
                                <img 
                                    class="h-10 w-10 flex-none rounded-full bg-flannel/90" 
                                    src={getOptimizedAvatarUrl(testimonial.avatar)}
                                    alt={testimonial.author}
                                    {...avatarProps}
                                />
                                <div class="flex-auto">
                                    <div class="font-semibold text-kohl/90 font-montserrat">{testimonial.author}</div>
                                    <div class="text-flannel/90 font-sourceSans">{@html testimonial.title}</div>
                                </div>
                                {#if testimonial.company}
                                    <img 
                                        class="h-8 w-auto flex-none opacity-90" 
                                        src={testimonial.company.logo} 
                                        alt={testimonial.company.name}
                                        width="120"
                                        height="32"
                                        loading="lazy"
                                        fetchpriority="low"
                                    >
                                {/if}
                            </figcaption>
                        </figure>
                    {/each}
                {/if}
                <div class="space-y-6 xl:contents xl:space-y-0">
                    <div class="space-y-6 xl:row-span-2">
                        {#each regularTestimonials.filter((t: Testimonial) => 
                            t.author !== 'Sarel' && 
                            t.author !== 'Heather Nichols' && 
                            t.author !== 'Jose' && 
                            t.author !== 'Anthony Becker'
                        ).slice(0, 2) as testimonial}
                            <figure class="rounded-2xl bg-ivory/90 p-6 shadow-lg ring-1 ring-flannel/20">
                                <blockquote class="text-kohl/90 font-montserrat">
                                    <p>"{testimonial.quote}"</p>
                                </blockquote>
                                <figcaption class="mt-6 flex items-center gap-x-4">
                                    <img class="h-10 w-10 rounded-full bg-flannel/90" src={testimonial.avatar} alt={testimonial.author} />
                                    <div>
                                        <div class="font-semibold text-kohl/90 font-montserrat">{testimonial.author}</div>
                                        <div class="text-flannel/90 font-sourceSans">{@html testimonial.title}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        {/each}
                        {#if regularTestimonials.find((t: Testimonial) => t.author === 'Drew P')}
                            {@const drewP = regularTestimonials.find((t: Testimonial) => t.author === 'Drew P')}
                            {#if drewP}
                                <figure class="rounded-2xl bg-ivory/95 p-6 shadow-lg ring-1 ring-flannel/20">
                                    <blockquote class="text-kohl font-montserrat">
                                        <p>"{drewP.quote}"</p>
                                    </blockquote>
                                    <figcaption class="mt-6 flex items-center gap-x-4">
                                        <img 
                                            class="h-10 w-10 rounded-full bg-flannel" 
                                            src={drewP.avatar} 
                                            alt="Drew P"
                                            width="40"
                                            height="40"
                                            loading="lazy"
                                            fetchpriority="low"
                                        />
                                        <div>
                                            <div class="font-semibold text-kohl font-montserrat">Drew P</div>
                                            <div class="text-flannel-600 font-sourceSans">{@html drewP.title}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            {/if}
                        {/if}
                    </div>
                    <div class="space-y-6 xl:row-start-1">
                        {#each regularTestimonials.filter((t: Testimonial) => 
                            t.author !== 'Sarel' && 
                            t.author !== 'Heather Nichols' && 
                            t.author !== 'Drew P' &&
                            t.author !== 'Jose' && 
                            t.author !== 'Anthony Becker'
                        ).slice(2, 4) as testimonial}
                            <figure class="rounded-2xl bg-ivory/90 p-6 shadow-lg ring-1 ring-flannel/20">
                                <blockquote class="text-kohl/90 font-montserrat">
                                    <p>"{testimonial.quote}"</p>
                                </blockquote>
                                <figcaption class="mt-6 flex items-center gap-x-4">
                                    <img class="h-10 w-10 rounded-full bg-flannel/90" src={testimonial.avatar} alt={testimonial.author} />
                                    <div>
                                        <div class="font-semibold text-kohl/90 font-montserrat">{testimonial.author}</div>
                                        <div class="text-flannel/90 font-sourceSans">{@html testimonial.title}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        {/each}
                    </div>
                    <div class="space-y-6 xl:row-span-2">
                        {#each regularTestimonials.filter((t: Testimonial) => 
                            t.author !== 'Sarel' && 
                            t.author !== 'Heather Nichols' && 
                            t.author !== 'Drew P' &&
                            t.author !== 'Jose' && 
                            t.author !== 'Anthony Becker'
                        ).slice(6) as testimonial}
                            <figure class="rounded-2xl bg-ivory/90 p-6 shadow-lg ring-1 ring-flannel/20">
                                <blockquote class="text-kohl/90 font-montserrat">
                                    <p>"{testimonial.quote}"</p>
                                </blockquote>
                                <figcaption class="mt-6 flex items-center gap-x-4">
                                    <img class="h-10 w-10 rounded-full bg-flannel/90" src={testimonial.avatar} alt={testimonial.author} />
                                    <div>
                                        <div class="font-semibold text-kohl/90 font-montserrat">{testimonial.author}</div>
                                        <div class="text-flannel/90 font-sourceSans">{@html testimonial.title}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>