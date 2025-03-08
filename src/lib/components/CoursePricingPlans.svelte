<script lang="ts">
  import type { Course, PricingPlan } from '$lib/types/course';
  import { formatPrice, getCheckoutUrl } from '$lib/utils/pricing';
  import DOMPurify from 'isomorphic-dompurify';

  let { course } = $props<{ course: Course }>();

  // Simplified layout calculation with proper types
  let planLayouts = $derived(course.pricing_plans?.map((_: PricingPlan, i: number) => ({
    isMiddlePlan: i === 1,
    isFirstPlan: i === 0
  })) ?? []);

  // Sanitize feature HTML
  function sanitizeFeature(feature: string): string {
    return DOMPurify.sanitize(feature, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      ALLOWED_ATTR: []
    });
  }
</script>

<div data-testid="pricing-section" class="bg-kohl py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    {#if course.pricing_plans && course.pricing_plans.length > 0}
      <div class="bg-kohl">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-4xl text-center">
            <h3 class="text-h3 font-montserrat leading-7 text-cerulean">
              Pricing
            </h3>
            <p class="mt-2 text-h2 font-montserrat tracking-tight text-cerulean">
              Choose the right plan for&nbsp;you
            </p>
          </div>
          <p 
            data-testid="course-description" 
            class="mx-auto mt-6 max-w-2xl text-center text-p leading-8 text-ivory font-sourceSans"
          >
            {course.description}
          </p>
          <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {#each course.pricing_plans as plan, planIdx}
              {@const layout = planLayouts[planIdx]}
              <div 
                class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
                class:lg:z-10={layout.isMiddlePlan}
                class:lg:rounded-b-none={layout.isMiddlePlan}
                class:lg:mt-8={!layout.isMiddlePlan}
                class:lg:rounded-r-none={layout.isFirstPlan}
                class:lg:rounded-l-none={!layout.isFirstPlan && !layout.isMiddlePlan}
                data-testid="pricing-plan-card"
                role="article"
                aria-labelledby={plan.id}
              >
                <div>
                  <div class="flex items-center justify-between gap-x-4">
                    <h4 id={plan.id} class="text-h4 font-montserrat leading-8 text-corsair">
                      {plan.name}
                    </h4>
                    {#if plan.most_popular}
                      <p class="rounded-full bg-cerulean/10 px-2.5 py-1 text-cap font-semibold leading-5 text-cerulean">
                        Most popular
                      </p>
                    {/if}
                  </div>
                  <p class="mt-4 text-p leading-6 text-flannel font-sourceSans">
                    {plan.description}
                  </p>
                  <p class="mt-6 flex items-baseline gap-x-1">
                    <span data-testid="price-display" class="text-h2 font-montserrat tracking-tight text-corsair">
                      ${formatPrice(plan.price)}
                    </span>
                    <span class="text-cap font-semibold leading-6 text-flannel font-sourceSans">
                      {plan.slug?.includes('monthly') ? '/month' : ''}
                    </span>
                  </p>
                  <ul 
                    data-testid="feature-list" 
                    role="list" 
                    class="mt-8 space-y-3 text-p leading-6 text-flannel font-sourceSans"
                    aria-label={`Features for ${plan.name}`}
                  >
                    {#each plan.features as feature}
                      <li class="flex gap-x-3">
                        <svg class="h-6 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                        </svg>
                        {sanitizeFeature(feature)}
                      </li>
                    {/each}
                  </ul>
                </div>
                <a 
                  href={getCheckoutUrl(course.id, plan)} 
                  aria-describedby={plan.id}
                  class="mt-8 block rounded-md bg-cerulean px-3 py-2 text-center text-cap font-semibold leading-6 text-ivory shadow-sm hover:bg-corsair focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean"
                >
                  Get started
                </a>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <p class="text-center text-p text-ivory font-montserrat py-24">
        No pricing information available for this course
      </p>
    {/if}
  </div>
</div>