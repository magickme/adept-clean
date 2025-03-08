<script lang="ts">
    import type { FeaturedTeacherProps } from '../types/FeaturedTeacher';
    import { getFeaturedImageProps, getOptimizedImageUrl } from '$lib/utils/imageUtils';

    const props = $props();
    const { 
      title = 'Meet Our Team Member', 
      description,
      dataTestid,
      memberName,
      memberRole,
      memberBio,
      memberImage
    } = props;

    const imageProps = getFeaturedImageProps(false);
</script>

{#snippet memberCard()}
    <li class="bg-kohl/30 rounded-lg overflow-hidden">
      <div class="aspect-[3/2] w-full">
        <img 
          class="h-full w-full object-cover object-[center_33%]" 
          src={getOptimizedImageUrl(memberImage, 800)} 
          alt={memberName}
          {...imageProps}
        >
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="text-xl sm:text-2xl font-semibold leading-8 text-ivory font-montserrat">{memberName}</h3>
        <p class="mt-2 text-base leading-7 text-ivory/70 font-sourceSans">{memberRole}</p>
        <div class="mt-4 text-sm sm:text-base leading-7 text-ivory/70 font-sourceSans space-y-4">
          {@html memberBio}
        </div>
        <a
          href="https://www.jasonlouv.com"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 w-full sm:w-auto px-4 py-2 bg-cerulean text-ivory rounded-md hover:bg-corsair transition-colors duration-300 font-sourceSans inline-block text-center"
          aria-label="Visit Jason Louv's personal website to learn more about his work and teachings"
        >
          Visit Jason Louv's Website
        </a>
      </div>
    </li>
{/snippet}
  
<div class="bg-kohl py-12 sm:py-16 md:py-24" data-testid={dataTestid}>
  <div class="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-4 sm:px-6 lg:px-8 xl:grid-cols-3">
    <div class="mx-auto max-w-2xl lg:mx-0">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-cerulean font-montserrat">{@html title}</h2>
      <div class="mt-4 text-base sm:text-lg leading-8 text-ivory/70 font-sourceSans">
        {@html description}
      </div>
    </div>
    <ul role="list" class="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-8 xl:col-span-2">
      {@render memberCard()}
    </ul>
  </div>
</div>