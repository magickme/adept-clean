<script lang="ts">
    import { formatPrice } from '$lib/utils/pricing';
    import { cn } from '$lib/utils';
    import pricingData from '$lib/collections/pricing/pricing.json';
    
    let { course, bundle = false } = $props<{ 
      course?: any,
      bundle?: boolean 
    }>();
  
    let selectedPayment = $state('full');
    let selectedOption = $state(bundle ? 'bundle' : 'adept-1');
    let selectedTier = $state<string | null>(null);
    let displayCourse = $state(course);
    
    $effect(() => {
      if (selectedOption === 'bundle') {
        displayCourse = pricingData.bundles[0];
      } else {
        displayCourse = pricingData.courses.find(c => c.id === selectedOption) || course;
      }
    });
</script>
  
<div class="bg-kohl py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-h2 font-montserrat text-cerulean">
        Black Friday Special Offer
      </h2>
      <p class="mt-6 text-h4 text-ivory">
        {#if displayCourse?.tiers?.length >= 3}
          Save up to ${formatPrice(displayCourse.tiers[2].savings)} this Black Friday
        {:else if displayCourse?.tiers?.length > 0}
          Save up to ${formatPrice(displayCourse.tiers[displayCourse.tiers.length - 1].savings)} this Black Friday
        {:else}
          Save big this Black Friday
        {/if}
      </p>
      
      <!-- Course Selection -->
      <div class="mt-8 flex flex-col items-center gap-4">
        <div class="text-h4 text-ivory">Choose Your Journey</div>
        <div class="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            class={cn(
              "px-6 py-3 rounded-full font-montserrat text-lg",
              selectedOption === 'bundle'
                ? "bg-cerulean text-ivory"
                : "bg-transparent text-cerulean-DEFAULT border-2 border-cerulean-DEFAULT hover:bg-cerulean-DEFAULT/10"
            )}
            onclick={() => selectedOption = 'bundle'}
          >
            Complete Bundle
          </button>
          <button
            type="button"
            class={cn(
              "px-6 py-3 rounded-full font-montserrat text-lg",
              selectedOption === 'adept-1'
                ? "bg-cerulean-700 text-ivory"
                : "bg-transparent text-cerulean-DEFAULT border-2 border-cerulean-DEFAULT hover:bg-cerulean-DEFAULT/10"
            )}
            onclick={() => selectedOption = 'adept-1'}
          >
            Adept Initiative I
          </button>
          <button
            type="button"
            class={cn(
              "px-6 py-3 rounded-full font-montserrat text-lg",
              selectedOption === 'adept-2'
                ? "bg-cerulean-700 text-ivory"
                : "bg-transparent text-cerulean-DEFAULT border-2 border-cerulean-DEFAULT hover:bg-cerulean-DEFAULT/10"
            )}
            onclick={() => selectedOption = 'adept-2'}
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
            "px-4 py-2 rounded-full font-montserrat",
            selectedPayment === 'full' 
              ? "bg-cerulean-700 text-ivory" 
              : "bg-transparent text-cerulean border border-cerulean"
          )}
          onclick={() => selectedPayment = 'full'}
        >
          Pay in Full
        </button>
        <button
          type="button"
          class={cn(
            "px-4 py-2 rounded-full font-montserrat",
            selectedPayment === 'installments' 
              ? "bg-cerulean text-ivory" 
              : "bg-transparent text-cerulean border border-cerulean"
          )}
          onclick={() => selectedPayment = 'installments'}
        >
          3 Payments
        </button>
      </div>
    </div>

    <!-- Pricing Tiers -->
    <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
      {#if displayCourse?.tiers}
        {#each displayCourse.tiers as tier}
          <div class={cn(
            "rounded-3xl p-8 xl:p-10 flex flex-col h-full",
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
            <div class="mt-6 flex flex-col gap-2">
              {#if selectedPayment === 'full'}
                <div class="text-2xl line-through decoration-4 decoration-corsair text-flannel opacity-90">
                  ${formatPrice(tier.originalPrice)}
                </div>
                <div class="text-h2 text-ivory">
                  ${formatPrice(tier.salePrice)}
                </div>
              {:else}
                <div class="text-2xl line-through decoration-4 decoration-corsair text-flannel opacity-90">
                  ${formatPrice(tier.installments.originalPrice)}
                </div>
                <div class="text-h2 text-ivory">
                  ${formatPrice(tier.installments.amount)}
                </div>
                <div class="text-cap text-flannel">
                  × {tier.installments.count} payments
                </div>
              {/if}
            </div>
  
            <!-- Savings -->
            <div class={cn(
              "mt-2 text-cap font-semibold",
              tier.mostPopular ? "text-ivory" : "text-cerulean"
            )}>
              {#if selectedPayment === 'full'}
                Save ${formatPrice(tier.savings)} ({tier.savingsPercent}% off)
              {:else}
                Save ${formatPrice(tier.installments.savings)} Total ({Math.floor((tier.installments.savings / (tier.installments.originalPrice * tier.installments.count)) * 100)}% off)
              {/if}
            </div>
  
            <!-- Features -->
            <ul role="list" class="mt-8 space-y-3 flex-grow">
              {#each tier.features as feature}
                <li class="flex gap-x-3 text-cap text-ivory">
                  <svg class={cn(
                    "h-6 w-5 flex-none",
                    tier.mostPopular ? "text-ivory" : "text-cerulean"
                  )} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  {feature}
                </li>
              {/each}
            </ul>
  
            <!-- CTA Button -->
            <a
              href={selectedPayment === 'full' ? tier.checkoutLink : tier.installmentCheckoutLink}
              onclick={() => selectedTier = tier.name.toLowerCase()}
              class={cn(
                "mt-8 block w-full rounded-md px-3 py-2 text-center text-cap font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean",
                tier.mostPopular
                  ? "bg-ivory text-cerulean hover:text-corsair"
                  : "bg-cerulean text-ivory hover:bg-corsair"
              )}
            >
              Get Started Now
            </a>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>