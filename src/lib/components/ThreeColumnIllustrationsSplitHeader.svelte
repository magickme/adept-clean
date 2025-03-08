<script>
  import customerService from '$lib/collections/incentives/customer-service.json';
  const { 
    dataTestid = customerService.dataTestid,
    title = customerService.title,
    description = customerService.description,
    imageUrl = customerService.imageUrl,
    features = customerService.features
  } = $props();
</script>

<div class="bg-kohl" data-testid={dataTestid}>
  <div class="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
    <div class="mx-auto max-w-2xl px-4 lg:max-w-none">
      <div class="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
        <div>
          <h2 class="text-h1 tracking-tight text-ivory font-montserrat">
            {title}
          </h2>
          <p class="mt-4 text-p text-flannel font-sourceSans">
            {description}
          </p>
        </div>
        <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-kohl">
          <img
            src={imageUrl}
            alt=""
            class="object-cover object-center"
            width="800"
            height="600"
            data-loading="eager"
            data-decoding="async"
            data-fetchpriority="high"
          />
        </div>
      </div>
      <div class="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
        {#each features as feature}
          <div class="sm:flex lg:block">
            <div class="sm:flex-shrink-0">
              <img 
                  class="h-16 w-16" 
                  src={feature.icon} 
                  alt="" 
                  width="64" 
                  height="64"
                  data-loading="lazy"
                  data-decoding="async" 
              />
            </div>
            <div class="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
              <h3 class="text-h4 text-ivory font-montserrat">{feature.title}</h3>
              <p class="mt-2 text-p text-flannel font-sourceSans">
                {feature.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>