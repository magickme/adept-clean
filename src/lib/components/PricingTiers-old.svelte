<script lang="ts">
  import { formatPrice } from '$lib/utils/pricing';
  import { cn } from '$lib/utils';
  import type { Course } from '$lib/types/course';
  
  let { course, bundle = false } = $props<{ 
    course: Course,
    bundle?: boolean 
  }>();

  let selectedPayment = $state('full');
</script>

<div class="bg-kohl py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-h2 font-montserrat text-cerulean">
        {bundle ? 'Bundle Pricing' : 'Course Pricing'}
      </h2>
      <p class="mt-6 text-h4 text-ivory">
        Save up to ${formatPrice(course.tiers[2].savings)} this Black Friday
      </p>
      
      <!-- Payment toggle -->
      <div class="mt-8 flex justify-center gap-4">
        <button
          class={cn(
            "px-4 py-2 rounded-full font-montserrat",
            selectedPayment === 'full' 
              ? "bg-cerulean text-ivory" 
              : "bg-transparent text-cerulean border border-cerulean"
          )}
          on:click={() => selectedPayment = 'full'}
        >
          Pay in Full
        </button>
        <button
          class={cn(
            "px-4 py-2 rounded-full font-montserrat",
            selectedPayment === 'installments' 
              ? "bg-cerulean text-ivory" 
              : "bg-transparent text-cerulean border border-cerulean"
          )}
          on:click={() => selectedPayment = 'installments'}
        >
          3 Payments
        </button>
      </div>
    </div>

    <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
      {#each course.tiers as tier}
        <div class={cn(
          "rounded-3xl p-8 xl:p-10",
          tier.mostPopular 
            ? "bg-cerulean ring-2 ring-corsair relative" 
            : "bg-kohl ring-1 ring-ivory/10"
        )}>
          {#if tier.mostPopular}
            <div class="absolute -top-4 right-8 rounded-full bg-corsair px-4 py-1 text-cap text-ivory">
              Most Popular
            </div>
          {/if}
          
          <div class="flex items-center justify-between gap-x-4">
            <h3 class="text-h4 font-montserrat text-ivory">{tier.name}</h3>
          </div>

          <!-- Pricing -->
          <div class="mt-6 flex items-baseline gap-x-2">
            {#if selectedPayment === 'full'}
              <div class="text-sm line-through text-flannel">
                ${formatPrice(tier.originalPrice)}
              </div>
              <div class="text-h2 text-ivory">
                ${formatPrice(tier.salePrice)}
              </div>
            {:else}
              <div class="text-h2 text-ivory">
                ${formatPrice(tier.installments.amount)}
              </div>
              <div class="text-cap text-flannel">
                × {tier.installments.count} payments
              </div>
            {/if}
          </div>

          <!-- Savings -->
          <div class="mt-2 text-cap text-cerulean">
            Save ${formatPrice(tier.savings)} ({tier.savingsPercent}% off)
          </div>

          <!-- Features -->
          <ul role="list" class="mt-8 space-y-3">
            {#each tier.features as feature}
              <li class="flex gap-x-3 text-cap text-ivory">
                <svg class="h-6 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                </svg>
                {feature}
              </li>
            {/each}
          </ul>

          <!-- CTA Button -->
          <a
            href={`/checkout/${course.id}/${tier.name.toLowerCase()}`}
            class="mt-8 block w-full rounded-md bg-cerulean px-3 py-2 text-center text-cap font-semibold text-ivory hover:bg-corsair focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean"
          >
            Get Started Now
          </a>
        </div>
      {/each}
    </div>
  </div>
</div> 