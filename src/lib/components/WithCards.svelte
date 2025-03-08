<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';

	interface Unit {
	  icon: string;
	  name: string;
	  description: string;
	}

	function validateUnit(unit: Unit): boolean {
	  return Boolean(
	    unit &&
	    typeof unit.icon === 'string' &&
	    typeof unit.name === 'string' &&
	    typeof unit.description === 'string'
	  );
	}

	interface Props {
	  title: string;
	  description: string;
	  units: Unit[];
	  isDarkMode?: boolean;
	  isLoading?: boolean;
	  error?: string;
	}

	const {
	  title,
	  description,
	  units,
	  isDarkMode = false,
	  isLoading = false,
	  error
	} = $props();

	// Validate types first
	if (isDarkMode !== undefined && typeof isDarkMode !== 'boolean') {
	  throw new Error('WithCards: isDarkMode must be a boolean');
	}

	if (isLoading !== undefined && typeof isLoading !== 'boolean') {
	  throw new Error('WithCards: isLoading must be a boolean');
	}

	if (error !== undefined && typeof error !== 'string') {
	  throw new Error('WithCards: error must be a string or undefined');
	}

	if (!Array.isArray(units)) {
	  throw new Error('WithCards: units must be an array');
	}

	// Then validate required fields
	if (!title || !description) {
	  throw new Error('WithCards: title and description are required props');
	}

	// Finally validate unit structure
	if (!units.every(validateUnit)) {
	  throw new Error('WithCards: each unit must have icon, name, and description properties');
	}

	// Configure DOMPurify
	const config = {
	  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
	  ALLOWED_ATTR: [],
	  FORBID_ATTR: ['style', 'onclick', 'onerror']
	};

	let sanitizedDescription = $state('');

	// Move sanitization into a reactive context so it can be properly mocked in tests
	$effect(() => {
	  try {
	    sanitizedDescription = DOMPurify.sanitize(description, config);
	  } catch (error) {
	    console.error('Error sanitizing HTML:', error);
	    sanitizedDescription = description;
	  }
	});

	const containerClass = $derived(`relative isolate overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-gray-900'} py-24 sm:py-32`);
	const getUnitKey = (unit: Unit) => `${unit.name}-${unit.icon}`;
</script>
  
{#if error}
  <div class={containerClass} role="alert" aria-label="Error">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-h2 text-ivory font-montserrat">Error</h2>
        <p class="mt-6 text-p text-red-400 space-y-4 font-sourceSans">{error}</p>
      </div>
    </div>
  </div>
{:else if isLoading}
  <div class={containerClass} role="region" aria-label="Features" aria-busy="true">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <div class="h-12 bg-corsair animate-pulse rounded w-3/4"></div>
        <div class="mt-6 h-24 bg-corsair animate-pulse rounded"></div>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
        {#each Array(3) as _}
          <div class="h-32 bg-corsair animate-pulse rounded"></div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class={containerClass} role="region" aria-label="Features">
    <img
      src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
      alt=""
      role="presentation"
      class="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
      width="2830"
      height="1590"
    />
  
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-h2 text-ivory font-montserrat">{title}</h2>
        <p class="mt-6 text-p text-flannel space-y-4 font-sourceSans">{@html sanitizedDescription}</p>
      </div>
      <div
        class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        role="list"
      >
        {#each units as unit (getUnitKey(unit))}
          <div class="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10" role="listitem">
            <div class="text-3xl">{unit.icon}</div>
            <div class="min-w-0 flex-1">
              <h3 class="text-h4 text-ivory font-montserrat overflow-hidden text-ellipsis whitespace-nowrap">{unit.name}</h3>
              <p class="mt-2 text-cap text-flannel font-sourceSans overflow-hidden text-ellipsis whitespace-nowrap">{unit.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}