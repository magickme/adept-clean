<script lang="ts" module>
	export interface FAQ {
		question: string;
		answer: string;
		id?: string;
	}

	export interface ToggleEventDetail {
		index: number;
		isOpen: boolean;
		id?: string;
	}
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import defaultFaqs from '$lib/collections/faqs/faq.json';
	import DOMPurify from 'isomorphic-dompurify';

	const props = $props<{
		dataTestid?: string;
		faqs?: FAQ[];
		initialOpenIndex?: number;
		allowMultiple?: boolean;
	}>();

	const dataTestid = $derived(props.dataTestid ?? 'faq-outer-container');
	const faqs = $derived(props.faqs ?? defaultFaqs);
	const allowMultiple = $derived(props.allowMultiple ?? false);

	let isMounted = $state(false);
	let openIndexes = $state<number[]>([]);

	// Cache sanitized answers to avoid re-sanitizing on every render
	const sanitizedAnswers = $derived(
		new Map(faqs.map((faq: FAQ) => [faq.answer, DOMPurify.sanitize(faq.answer)]))
	);

	const dispatch = createEventDispatcher<{
		toggle: ToggleEventDetail;
	}>();

	// Combine mount and initial index effects
	$effect.pre(() => {
		const { initialOpenIndex } = props;
		if (initialOpenIndex !== undefined && 
			initialOpenIndex >= 0 && 
			initialOpenIndex < faqs.length) {
			openIndexes = [initialOpenIndex];
		}
		
		// Use setTimeout for more reliable test behavior
		setTimeout(() => {
			isMounted = true;
		}, 0);
	});

	function toggleAccordion(index: number): void {
		const isCurrentlyOpen = openIndexes.includes(index);
		const newOpenIndexes = allowMultiple
			? isCurrentlyOpen
				? openIndexes.filter(i => i !== index)
				: [...openIndexes, index]
			: isCurrentlyOpen 
				? [] 
				: [index];
		
		// Batch state updates
		queueMicrotask(() => {
			openIndexes = newOpenIndexes;
			
			const detail: ToggleEventDetail = { 
				index, 
				isOpen: !isCurrentlyOpen,
				id: faqs[index].id 
			};

			dispatch('toggle', detail);
			document.dispatchEvent(new CustomEvent('toggle', {
				detail,
				bubbles: true,
				composed: true
			}));
		});
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleAccordion(index);
		}
	}
</script>

<div data-testid={dataTestid}>
	<div
		class="bg-kohl transition-colors duration-300"
		class:opacity-0={!isMounted}
		class:opacity-100={isMounted}
		data-testid="faq-inner-container"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
			<div class="mx-auto max-w-4xl divide-y divide-corsair">
				<h2 class="text-2xl sm:text-h2 font-montserrat text-ivory">
					Frequently asked questions
				</h2>
				<dl class="mt-8 sm:mt-10 space-y-4 sm:space-y-6 divide-y divide-corsair">
					{#each faqs as faq, index}
						<div class="faq-item border-b border-corsair py-6">
							<dt class="text-lg font-medium text-ivory" id="{faq.id ?? `faq-${index}`}-question">
								{faq.question}
							</dt>
							<dd>
								<button
									type="button"
									class="flex w-full items-center justify-between text-left text-ivory mt-2"
									onclick={() => toggleAccordion(index)}
									onkeydown={(e) => handleKeydown(e, index)}
									aria-expanded={openIndexes.includes(index)}
									aria-controls="{faq.id ?? `faq-${index}`}-answer"
									aria-labelledby="{faq.id ?? `faq-${index}`}-question"
								>
									<span class="sr-only">Toggle answer for: {faq.question}</span>
									<span class="ml-6 flex-shrink-0" aria-hidden="true">
										<svg 
											class="h-6 w-6" 
											fill="none" 
											viewBox="0 0 24 24" 
											stroke-width="1.5" 
											stroke="currentColor"
										>
											<path 
												stroke-linecap="round" 
												stroke-linejoin="round" 
												d={openIndexes.includes(index) ? "M19.5 12h-15" : "M12 4.5v15m7.5-7.5h-15"}
											/>
										</svg>
									</span>
								</button>
								{#if openIndexes.includes(index)}
									<div 
										id="{faq.id ?? `faq-${index}`}-answer"
										in:slide={{ duration: 300 }}
										class="faq-answer pt-4"
										role="region"
										aria-labelledby="{faq.id ?? `faq-${index}`}-question"
									>
										<p class="text-base text-ivory">{@html sanitizedAnswers.get(faq.answer)}</p>
									</div>
								{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</div>
</div>

<style>
	.faq-item {
		@apply pt-4 sm:pt-6;
		display: flex;
		flex-direction: column;
	}

	.faq-answer {
		@apply text-sm sm:text-base;
		flex-grow: 1;
	}
</style>