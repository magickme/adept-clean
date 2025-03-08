<script lang="ts">
	const {
		dataTestid = 'simple-centered-brand',
		title = 'Ready to get started?',
		description = '',
		ctaText = 'Sign Up',
		ctaHref = '#',
		trailerText = '',
		trailerHref = '#'
	} = $props<{
		dataTestid?: string;
		title?: string;
		description?: string;
		ctaText?: string;
		ctaHref?: string;
		trailerText?: string;
		trailerHref?: string;
	}>();

	// Base classes
	const linkBaseClass = "text-lg font-bold transition-all duration-200 font-montserrat";
	
	// Derived classes
	const ctaClass = $derived(`${linkBaseClass} rounded-lg bg-corsair px-6 py-3 text-ivory shadow-lg hover:bg-corsair/90 hover:scale-105`);
	const trailerClass = $derived(`${linkBaseClass} text-ivory hover:text-cerulean inline-flex items-center`);
</script>

<section 
	class="py-16 sm:py-24" 
	data-testid={dataTestid}
	aria-labelledby="brand-title"
>
	<div class="mx-auto max-w-4xl px-4 sm:px-6">
		<div class="bg-gradient-to-br from-cerulean to-corsair rounded-xl p-6 sm:p-12 shadow-2xl">
			<div class="mx-auto max-w-2xl text-center">
				<h2 
					id="brand-title"
					data-testid={`${dataTestid}-title`}
					class="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-ivory font-montserrat"
				>
					{title}
				</h2>

				{#if description}
					<p class="mb-8 text-lg sm:text-xl text-ivory/90 font-sourceSans">{description}</p>
				{/if}

				<div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
					<a  
						data-testid={`${dataTestid}-cta`}
						href={ctaHref}
						class={ctaClass}
					>
						{ctaText}
					</a>

					{#if trailerText}
						<a
							data-testid={`${dataTestid}-trailer`}
							href={trailerHref}
							class={trailerClass}
						>
							{trailerText}
							<span class="sr-only">Watch our trailer video</span>
							<svg 
								data-testid="trailer-icon"
								aria-hidden="true"
								class="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" 
								viewBox="0 0 24 24"
								stroke="currentColor"
								fill="none"
							>
								<path 
									d="M9 5l7 7-7 7"
									stroke-linecap="round" 
									stroke-linejoin="round" 
									stroke-width="2" 
								/>
							</svg>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@media (max-width: 640px) {
		.flex-col > :global(a) {
			width: 100%;
			text-align: center;
			justify-content: center;
		}
	}
</style>