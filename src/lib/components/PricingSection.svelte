<script lang="ts">
	const {
		course
	} = $props<{
		course: any;
	}>();

	const features = [
		"Lifetime Access to Course Materials",
		"Private Community Access",
		"Live Q&A Sessions",
		"Downloadable Resources",
		"Mobile & Desktop Access",
		"Certificate of Completion"
	];
</script>

<section class="py-16 sm:py-24 bg-kohl" id="pricing">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ivory font-montserrat mb-4">
				Choose Your Path
			</h2>
			<p class="text-lg sm:text-xl text-flannel font-sourceSans mb-8">
				Select the package that best fits your journey. All plans include lifetime access.
			</p>
		</div>

		<div class="mt-8 flex justify-center">
			<div class="relative rounded-2xl bg-gradient-to-br from-cerulean to-corsair p-8 shadow-2xl">
				<div class="text-center">
					<h3 class="text-2xl font-bold text-ivory font-montserrat mb-2">
						Complete Package
					</h3>
					<div class="flex items-center justify-center">
						<span class="text-5xl font-bold tracking-tight text-ivory">$1,347</span>
					</div>
				</div>

				<ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-ivory">
					{#each features as feature}
						<li class="flex gap-x-3">
							<svg class="h-6 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
							</svg>
							{feature}
						</li>
					{/each}
				</ul>

				<a
					href="/enroll"
					class="mt-8 block w-full rounded-lg bg-ivory px-6 py-4 text-center text-lg font-semibold text-corsair shadow-sm hover:bg-ivory/90 hover:scale-105 transition-all duration-200 font-montserrat"
				>
					Enroll Now
				</a>
			</div>
		</div>

		<p class="mt-8 text-center text-sm text-flannel">
			Prices in USD. Includes all applicable taxes.
			<a href="#faq" class="font-semibold text-cerulean hover:text-corsair">
				Learn more about our refund policy
			</a>
		</p>
	</div>
</section> 