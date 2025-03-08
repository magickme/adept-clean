<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import type { Unit } from '$lib/types/course';

	interface Props {
		title: string;
		description: string;
		units: Unit[];
		isDarkMode?: boolean;
	}

	const { title, description, units, isDarkMode = false } = $props();

	// Configure DOMPurify
	const config = {
		ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
		ALLOWED_ATTR: [],
		FORBID_ATTR: ['style', 'onclick', 'onerror']
	};

	let sanitizedDescription = $state('');

	$effect(() => {
		try {
			sanitizedDescription = DOMPurify.sanitize(description, config);
		} catch (error) {
			console.error('Error sanitizing HTML:', error);
			sanitizedDescription = description;
		}
	});

	const containerClass = $derived(`relative py-8 sm:py-12`);

	// Map of module numbers to their appropriate skills
	const moduleSkills: Record<number, string[]> = {
		1: ['True Will', 'Asana', 'Gnosis'],
		2: ['Pranayama', 'Dharana', 'Energy Work'],
		3: ['Sacred Space', 'Ritual', 'Manifestation'],
		4: ['Astral', 'Evocation', 'Pathworking'],
		5: ['Great Work', 'Synthesis', 'Ascension']
	};

	function getSkillsForModule(index: number): string[] {
		return moduleSkills[index + 1] || ['Skill 1', 'Skill 2', 'Skill 3'];
	}
</script>

<div class={containerClass} role="region" aria-label="Curriculum Section">
	<div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
		<div class="relative mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl mb-12 sm:mb-20">
			<div class="relative">
				<h2 class="text-3xl sm:text-4xl font-bold tracking-tight sm:text-6xl font-montserrat mb-6 sm:mb-8 text-ivory whitespace-pre-line">
					{title}
				</h2>
			</div>

			<p class="text-lg sm:text-xl leading-8 text-ivory/90 font-sourceSans max-w-3xl">
				{@html sanitizedDescription}
			</p>
		</div>
		
		<div class="relative mx-auto max-w-5xl">
			<div class="relative grid gap-8 sm:gap-16" role="list">
				{#each units as unit, i}
					<div class="relative pl-14 sm:pl-16">
						<div 
							class="relative flex items-start gap-x-4 sm:gap-x-8 rounded-2xl bg-black/40 p-4 sm:p-10 ring-1 ring-inset ring-white/10 
									hover:bg-cerulean/10 transition-all duration-500 hover:ring-cerulean/50 
									hover:shadow-lg hover:shadow-cerulean/20 group backdrop-blur-sm
									transform hover:scale-105 hover:-translate-y-1"
							role="listitem"
							style="animation-delay: {i * 200}ms"
						>
							<div class="absolute -left-14 sm:-left-16 top-1/2 -translate-y-1/2">
								<div class="relative w-11 sm:w-12 h-11 sm:h-12">
									<div class="absolute inset-0 bg-cerulean rounded-full opacity-20 animate-ping"></div>
									<div class="relative w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-cerulean/20 
											flex items-center justify-center text-cerulean text-base sm:text-base font-bold 
											ring-2 ring-cerulean/50">
										{i + 1}
									</div>
								</div>
							</div>

							<div class="relative text-3xl sm:text-5xl self-start pt-1 group-hover:scale-110 transition-transform duration-300">
								<div class="absolute inset-0 bg-cerulean-DEFAULT opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
								{unit.icon}
							</div>

							<div class="flex-1">
								<h3 class="text-xl sm:text-2xl font-semibold leading-7 text-white font-montserrat mb-4 
										group-hover:text-cerulean-DEFAULT transition-colors duration-300 flex flex-wrap items-center gap-3">
									{unit.name}
									<span class="text-xs sm:text-sm font-normal text-cerulean-DEFAULT bg-cerulean-DEFAULT/10 px-2 py-1 rounded-full">
										Level {i + 1}
									</span>
								</h3>
								
								<p class="text-base sm:text-lg leading-7 text-gray-300 font-sourceSans group-hover:text-gray-200">
									{unit.description}
								</p>

								<div class="mt-6 -ml-2 sm:ml-0">
									<h4 class="text-sm font-semibold text-cerulean pl-2 sm:pl-0 mb-4">Skills Unlocked:</h4>
									<ul class="flex flex-wrap gap-2 sm:gap-3">
										{#each unit.skills_unlocked || [] as skill}
											<li class="skill-item">
												<span class="skill-dot"></span>
												{skill}
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	[role="listitem"] {
		animation: slideIn 0.5s ease-out forwards;
		opacity: 0;
		transform: translateY(20px);
	}

	@keyframes slideIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}

	.float {
		animation: float 3s ease-in-out infinite;
	}

	.skill-item {
		@apply relative flex items-center gap-2 rounded-md bg-black/50 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm 
				font-medium text-cerulean ring-1 ring-inset ring-cerulean/20;
	}

	.skill-item:hover {
		@apply ring-cerulean/40;
		background: linear-gradient(to right, rgba(0, 163, 220, 0.2), rgba(23, 90, 115, 0.2));
	}

	.skill-dot {
		@apply w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cerulean;
	}
</style> 