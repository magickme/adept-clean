<script lang="ts">
  import DOMPurify from 'isomorphic-dompurify';

  /**
   * @typedef Feature
   * @property {string} [icon] - Emoji or icon character to display
   * @property {string} [title] - Feature title
   * @property {string} [description] - Feature description
   * @property {string} [linkText] - Text for the feature link
   * @property {string} [linkUrl] - URL for the feature link
   */
  interface Feature {
    icon: string;
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
  }

  /**
   * @typedef Props
   * @property {string} [title] - Main title of the section
   * @property {string} [subtitle] - Subtitle with optional HTML formatting
   * @property {string} [description] - Description with optional HTML formatting
   * @property {Feature[]} [features] - Array of feature items to display
   */
  const { 
    title,
    subtitle,
    description,
    features
  } = $props();
  
  // Configure DOMPurify to strip unwanted attributes
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [], // No attributes allowed
    FORBID_ATTR: ['style', 'onclick', 'onerror'] // Explicitly forbid these attributes
  };

  // Sanitize HTML content
  const sanitizedSubtitle = $derived(subtitle ? DOMPurify.sanitize(subtitle, config) : '');
  const sanitizedDescription = $derived(description ? DOMPurify.sanitize(description, config) : '');
</script>

<div class="bg-kohl py-12 sm:py-16" data-testid="three-column-container">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-7xl font-montserrat font-semibold leading-tight text-cerulean-DEFAULT mb-3" 
          id="section-title">{title}</h2>
      <h3 class="text-3xl font-montserrat font-bold text-ivory mb-4" 
          aria-labelledby="section-title">{@html sanitizedSubtitle}</h3>
      <p class="mt-4 text-p font-sourceSans leading-8 text-ivory text-left" 
         aria-label="Section description">{@html sanitizedDescription}</p>
    </div>
    <div class="mx-auto mt-8 max-w-2xl sm:mt-10 lg:mt-12 lg:max-w-none">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3" 
          data-testid="features-grid"
          aria-label="Feature list">
        {#each features as feature}
          <div class="flex flex-col" data-testid="feature-item">
            <dt class="flex items-center gap-x-3 text-p font-montserrat font-semibold leading-7 text-ivory">
              <span class="text-4xl text-cerulean-DEFAULT" aria-hidden="true">{feature.icon || ''}</span>
              {feature.title || ''}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-p font-sourceSans leading-7 text-ivory/70">
              <p class="flex-auto">{feature.description || ''}</p>
              {#if feature.linkText && feature.linkUrl}
                <p class="mt-6">
                  <a href={feature.linkUrl} 
                     class="text-cap font-sourceSans font-semibold leading-6 text-cerulean-DEFAULT hover:text-corsair-600"
                     aria-label={`Learn more about ${feature.title}`}>
                    {feature.linkText} <span aria-hidden="true">→</span>
                  </a>
                </p>
              {/if}
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</div>