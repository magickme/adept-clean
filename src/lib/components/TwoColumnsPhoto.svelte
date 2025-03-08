<script lang="ts">
  interface Props {
    dataTestid?: string;
    imageSrc?: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    features?: string[];
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
  }

  let {
    dataTestid = 'two-columns-photo',
    imageSrc = '/path/to/your/triangle-image.jpg',
    imageAlt = 'Glitchy triangle',
    title = "What's in every Magick.Me subscription?",
    description = 'This class, and over 30 more, are included when you subscribe to Magick.Me. Why not get everything?',
    features = [
      'All 30+ classes and office hours',
      'Audio-only lessons',
      'Download & watch offline (select plans)',
      'Downloadable course workbooks',
      'Watch on desktop, TV or mobile devices',
      'New classes added daily!'
    ],
    ctaText = 'Sign Up',
    ctaHref = '/signup',
    secondaryCtaText = 'Gift',
    secondaryCtaHref = '/gift'
  } = $props();
</script>

<section data-testid={dataTestid} class="relative bg-kohl text-ivory py-16 sm:py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-center">
      <div class="relative">
        <img
          class="w-full max-w-lg rounded-2xl object-cover lg:max-w-none"
          src={imageSrc}
          alt={imageAlt}
          width="640"
          height="480"
        />
      </div>
      <div>
        <h2 class="text-h2 font-montserrat">{title}</h2>
        <p class="mt-4 text-p text-flannel font-sourceSans">{description}</p>
        <ul class="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {#each features as feature}
            <li class="flex items-center">
              <svg class="h-5 w-5 flex-none text-cerulean" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
              </svg>
              <span class="ml-3 text-p text-flannel font-sourceSans">{feature}</span>
            </li>
          {/each}
        </ul>
        <div class="mt-10 flex items-center gap-x-6">
          <a
            href={ctaHref}
            class="rounded-md bg-cerulean px-3.5 py-2.5 text-cap font-montserrat text-ivory shadow-sm hover:bg-cerulean-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean"
          >
            {ctaText}
          </a>
          <a
            href={secondaryCtaHref}
            class="rounded-md bg-cerulean-600 px-3.5 py-2.5 text-cap font-montserrat text-ivory shadow-sm hover:bg-cerulean-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean"
          >
            {secondaryCtaText}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>