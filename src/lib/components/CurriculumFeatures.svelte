<script lang="ts">
  // Add TypeScript interfaces for better type safety
  interface CurriculumHead {
    prehead: string;
    title: string;
    description?: string;
  }

  interface CurriculumFeature {
    name: string;
    description?: string;
  }

  interface CurriculumData {
    curriculum_head: CurriculumHead;
    curriculum_features?: CurriculumFeature[] | null;
  }

  // Use typed props
  let { data } = $props<{data: CurriculumData}>();
  
  // Use state instead of derived for these values
  let head = $state(data.curriculum_head);
  let features = $state(data.curriculum_features ?? []);

  // Update values when props change
  $effect(() => {
    queueMicrotask(() => {
      head = data.curriculum_head;
      features = data.curriculum_features ?? [];
    });
  });

  // Add validation
  $effect.pre(() => {
    if (!head.prehead || !head.title) {
      console.warn('CurriculumFeatures: Required curriculum_head fields missing');
    }
  });
</script>

<div class="bg-ivory dark:bg-kohl py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <div>
        <h2 class="text-base font-montserrat text-cerulean">{head.prehead}</h2>
        <p class="mt-2 text-h2 font-montserrat text-kohl dark:text-ivory">{head.title}</p>
        {#if head.description}
          <p class="mt-6 text-p font-sourceSans text-kohl/80 dark:text-ivory/80">{head.description}</p>
        {/if}
      </div>
      
      <dl class="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-p text-kohl/80 dark:text-ivory/80 sm:grid-cols-2 lg:gap-y-16">
        {#each features as feature (feature.name)}
          <dt class="relative pl-9 font-montserrat text-h4 text-kohl dark:text-ivory">
            <svg
              class="absolute left-0 top-1 h-5 w-5 text-cerulean"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="feature-name">{feature.name}</span>
          </dt>
          {#if feature.description}
            <dd class="relative pl-9 mt-2 text-p font-sourceSans text-kohl/80 dark:text-ivory/80">{feature.description}</dd>
          {/if}
        {/each}
      </dl>
    </div>
  </div>
</div>

</```rewritten_file>