<script lang="ts">
	import { formatPrice } from '$lib/utils/pricing';
	import { cn } from '$lib/utils';
	import pricingData from '$lib/collections/pricing/pricing.json';

	const {
		course,
		bundle = false
	} = $props<{
		course?: any;
		bundle?: boolean;
	}>();

	let selectedPayment = $state('full');
	let selectedOption = $state(bundle ? 'bundle' : 'adept-1');
	let selectedTier = $state<string | null>(null);
	let displayCourse = $state(course);

	$effect(() => {
		if (selectedOption === 'bundle') {
			displayCourse = pricingData.bundles[0];
		} else {
			displayCourse = pricingData.courses.find((c) => c.id === selectedOption) || course;
		}
	});

	const commonFeatures = [
		'Lifetime Access to Course Materials',
		'Private Community Access',
		'Live Q&A Sessions',
		'Downloadable Resources',
		'Mobile & Desktop Access',
		'Certificate of Completion'
	];

	let pricingPlans = [
		{
			name: "Core Bundle",
			price: 1197,
			features: [
				"Full access to core course modules",
				"Lifetime access",
				"General community forum access",
				"Digital Welcome Kit"
			],
			isPopular: false,
			checkoutLink: "https://sso.teachable.com/secure/8093/checkout/5979377/complete-adept-initiative-i-ii-bundle",
			installmentCheckoutLink: "https://sso.teachable.com/secure/8093/checkout/5979427/complete-adept-initiative-i-ii-bundle",
			installments: {
				amount: 399,
				count: 3
			}
		},
		{
			name: "Premium Bundle",
			price: 1697,
			features: [
				"Everything in Standard",
				"Advanced modules & bonus rituals",
				"Live group coaching sessions",
				"Premium community access",
				"Access to weekly Q&A Office Hours",
				"Bonus Workshop: Magickal Planning 2025"
			],
			isPopular: true,
			checkoutLink: "https://sso.teachable.com/secure/8093/checkout/5979379/complete-adept-initiative-i-ii-bundle",
			installmentCheckoutLink: "https://sso.teachable.com/secure/8093/checkout/5979430/complete-adept-initiative-i-ii-bundle",
			installments: {
				amount: 566,
				count: 3
			}
		},
		{
			name: "VIP Bundle",
			price: 2497,
			features: [
				"Everything in Premium",
				"Two 1-on-1 coaching sessions with Jason Louv",
				"Exclusive live workshops",
				"Jason Louv will personally craft a magical action plan for you",
				"VIP-only community access",
				"Priority scheduling",
				"Two exclusive Group Coachings in February & April 2025"
			],
			isPopular: false,
			checkoutLink: "https://sso.teachable.com/secure/8093/checkout/5979380/complete-adept-initiative-i-ii-bundle",
			installmentCheckoutLink: "https://sso.teachable.com/secure/8093/checkout/5979431/complete-adept-initiative-i-ii-bundle",
			installments: {
				amount: 833,
				count: 3
			}
		}
	];
</script>

<section class="py-16 sm:py-24 bg-kohl" id="pricing">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-h2 font-montserrat text-cerulean">
				Choose Your Path
			</h2>
			<p class="mt-6 text-h4 text-ivory">
				Select the package that best fits your journey
			</p>

			<!-- Course Selection -->
			<div class="mt-8 flex flex-col items-center gap-4">
				<div class="text-h4 text-ivory">Choose Your Journey</div>
				<div class="flex flex-wrap justify-center gap-4">
					<button
						type="button"
						class={cn(
							'px-6 py-3 rounded-full font-montserrat text-lg transition-all duration-200',
							selectedOption === 'bundle'
								? 'bg-cerulean-600 text-ivory'
								: 'bg-transparent text-cerulean-600 border-2 border-cerulean-600 hover:bg-cerulean-600/10'
						)}
						onclick={() => (selectedOption = 'bundle')}
					>
						Complete Bundle
					</button>
					<button
						type="button"
						class={cn(
							'px-6 py-3 rounded-full font-montserrat text-lg transition-all duration-200',
							selectedOption === 'adept-1'
								? 'bg-cerulean text-ivory'
								: 'bg-transparent text-cerulean border-2 border-cerulean hover:bg-cerulean/10'
						)}
						onclick={() => (selectedOption = 'adept-1')}
					>
						Adept Initiative I
					</button>
					<button
						type="button"
						class={cn(
							'px-6 py-3 rounded-full font-montserrat text-lg transition-all duration-200',
							selectedOption === 'adept-2'
								? 'bg-cerulean text-ivory'
								: 'bg-transparent text-cerulean border-2 border-cerulean hover:bg-cerulean/10'
						)}
						onclick={() => (selectedOption = 'adept-2')}
					>
						Adept Initiative II
					</button>
				</div>
			</div>

			<!-- Payment toggle -->
			<div class="mt-8 flex justify-center gap-4">
				<button
					type="button"
					class={cn(
						'px-4 py-2 rounded-full font-montserrat transition-all duration-200',
						selectedPayment === 'full'
							? 'bg-cerulean text-ivory'
							: 'bg-transparent text-cerulean border border-cerulean hover:bg-cerulean/10'
					)}
					onclick={() => (selectedPayment = 'full')}
				>
					Pay in Full
				</button>
				<button
					type="button"
					class={cn(
						'px-4 py-2 rounded-full font-montserrat transition-all duration-200',
						selectedPayment === 'installments'
							? 'bg-cerulean text-ivory'
							: 'bg-transparent text-cerulean border border-cerulean hover:bg-cerulean/10'
					)}
					onclick={() => (selectedPayment = 'installments')}
				>
					3 Payments
				</button>
			</div>
		</div>

		<!-- Pricing Tiers -->
		<div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
			{#if selectedOption === 'bundle'}
				{#each pricingPlans as plan}
					<div class={cn(
						'relative rounded-2xl p-8 shadow-2xl flex flex-col',
						plan.isPopular
							? 'bg-gradient-to-br from-cerulean to-corsair ring-2 ring-corsair'
							: 'bg-gradient-to-br from-kohl to-corsair/50 ring-1 ring-ivory/10'
					)}>
						{#if plan.name === "VIP Bundle"}
							<div class="absolute inset-0 bg-black/80 rounded-2xl z-10 flex items-center justify-center">
								<span class="text-4xl font-bold text-ivory rotate-[-20deg] font-montserrat">SOLD OUT</span>
							</div>
						{/if}

						<!-- Header Section -->
						<div class="text-center mb-8">
							<h3 class="text-2xl font-bold text-ivory font-montserrat mb-2">
								{plan.name}
							</h3>

							<!-- Pricing -->
							<div class="flex items-center justify-center">
								{#if selectedPayment === 'full'}
									<span class="text-5xl font-bold tracking-tight text-ivory">
										${plan.price}
									</span>
								{:else}
									<span class="text-5xl font-bold tracking-tight text-ivory">
										${plan.installments.amount}
									</span>
									<span class="text-lg text-ivory/80">× {plan.installments.count}</span>
								{/if}
							</div>
						</div>

						<!-- Features -->
						<div class="flex-grow mb-8">
							<ul role="list" class="space-y-3 text-sm leading-6 text-ivory">
								{#each plan.features as feature}
									<li class="flex gap-x-3">
										<svg class="h-6 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
										</svg>
										{#if selectedOption === 'bundle'}
											{#if plan.name === 'Core Bundle' && feature === 'Full access to core course modules'}
												Full access to core course modules for Adept Initiative I + II
											{:else if plan.name === 'Premium Bundle' && feature === 'Live group coaching sessions'}
												Live group coaching sessions for both Adept Initiative I + II
											{:else if plan.name === 'VIP Bundle' && feature === 'Two 1-on-1 coaching sessions with Jason Louv'}
												Four 1-on-1 coaching sessions with Jason Louv
											{:else}
												{feature}
											{/if}
										{:else}
											{feature}
										{/if}
									</li>
								{/each}
							</ul>
						</div>

						<!-- CTA Button -->
						<div class="mt-auto">
							{#if plan.name === "VIP Bundle"}
								<button
									disabled
									class="block w-full rounded-lg px-6 py-4 text-center text-lg font-semibold shadow-sm font-montserrat bg-gray-600 text-ivory/50 cursor-not-allowed"
								>
									Sold Out
								</button>
							{:else}
								<a
									href={selectedPayment === 'full' ? plan.checkoutLink : plan.installmentCheckoutLink}
									class={cn(
										'block w-full rounded-lg px-6 py-4 text-center text-lg font-semibold shadow-sm hover:scale-105 transition-all duration-200 font-montserrat',
										plan.isPopular
											? 'bg-ivory text-corsair-600 hover:bg-ivory/90'
											: 'bg-cerulean-700 text-ivory hover:bg-cerulean-600'
									)}
								>
									Enroll Now
								</a>
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				{#each displayCourse?.tiers || [] as tier}
					<div class={cn(
						'relative rounded-2xl p-8 shadow-2xl flex flex-col',
						tier.mostPopular
							? 'bg-gradient-to-br from-cerulean-DEFAULT to-corsair-600 ring-2 ring-corsair-600'
							: 'bg-gradient-to-br from-kohl to-corsair-600/50 ring-1 ring-ivory/10'
					)}>
						{#if tier.name === "VIP"}
							<div class="absolute inset-0 bg-black/80 rounded-2xl z-10 flex items-center justify-center">
								<span class="text-4xl font-bold text-ivory rotate-[-20deg] font-montserrat">SOLD OUT</span>
							</div>
						{/if}

						<!-- Header Section -->
						<div class="text-center mb-8">
							<h3 class="text-2xl font-bold text-ivory font-montserrat mb-2">
								{tier.name}
							</h3>

							<!-- Pricing -->
							<div class="flex items-center justify-center">
								{#if selectedPayment === 'full'}
									<span class="text-5xl font-bold tracking-tight text-ivory">
										${formatPrice(tier.originalPrice)}
									</span>
								{:else}
									<span class="text-5xl font-bold tracking-tight text-ivory">
										${formatPrice(tier.installments.amount)}
									</span>
									<span class="text-lg text-ivory/80">× {tier.installments.count}</span>
								{/if}
							</div>
						</div>

						<!-- Features -->
						<div class="flex-grow mb-8">
							<ul role="list" class="space-y-3 text-sm leading-6 text-ivory">
								{#each tier.features as feature}
									<li class="flex gap-x-3">
										<svg class="h-6 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
										</svg>
										{#if selectedOption === 'adept-1' && tier.name === 'VIP' && feature === 'Exclusive Group Coaching in April 2025'}
											Exclusive Group Coaching in February 2025
										{:else}
											{feature}
										{/if}
									</li>
								{/each}
							</ul>
						</div>

						<!-- CTA Button -->
						<div class="mt-auto">
							{#if tier.name === "VIP"}
								<button
									disabled
									class="block w-full rounded-lg px-6 py-4 text-center text-lg font-semibold shadow-sm font-montserrat bg-gray-600 text-ivory/50 cursor-not-allowed"
								>
									Sold Out
								</button>
							{:else}
								<a
									href={selectedPayment === 'full' ? tier.checkoutLink : tier.installmentCheckoutLink}
									class={cn(
										'block w-full rounded-lg px-6 py-4 text-center text-lg font-semibold shadow-sm hover:scale-105 transition-all duration-200 font-montserrat',
										tier.mostPopular
											? 'bg-ivory text-corsair-600 hover:bg-ivory/90'
											: 'bg-cerulean-700 text-ivory hover:bg-cerulean-600'
									)}
								>
									Enroll Now
								</a>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<p class="mt-8 text-center text-sm text-flannel">
			Prices in USD. Includes all applicable taxes.
			<a href="#faq" class="font-semibold text-cerulean hover:text-corsair"> Learn more about our refund policy </a>
		</p>
	</div>
</section>

<style>
	/* Add hover animation for CTA */
	:global(.hover\:scale-105:hover) {
		transform: scale(1.05);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	}

	/* Improve mobile responsiveness */
	@media (max-width: 640px) {
		.flex-wrap {
			@apply flex-col;
		}

		button {
			@apply w-full;
		}
	}

	/* Add smooth transitions for pricing cards */
	:global(.rounded-2xl) {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.rounded-2xl:hover) {
		transform: translateY(-4px);
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}

	/* Enhance button transitions */
	:global(button) {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(button:hover) {
		transform: translateY(-1px);
	}

	:global(button:active) {
		transform: translateY(1px);
	}
</style> 