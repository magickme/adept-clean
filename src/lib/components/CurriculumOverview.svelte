<script lang="ts">
    interface CurriculumHead {
      prehead?: string;
      title?: string;
      description?: string;
    }
  
    interface Feature {
      name: string;
      description?: string;
    }
  
    let { curriculumHead, features } = $props<{
      curriculumHead: CurriculumHead;
      features: Feature[];
    }>();
</script>
  
<div class="bg-kohl py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div>
                <h2 class="text-h4 font-montserrat text-cerulean">{curriculumHead.prehead}</h2>
                <p class="mt-2 text-h2 font-montserrat text-ivory">
                    {curriculumHead.title}
                </p>
                {#if curriculumHead.description}
                    <p class="mt-6 text-p font-sourceSans text-flannel">{curriculumHead.description}</p>
                {/if}
            </div>
            <dl class="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-p text-flannel sm:grid-cols-2 lg:gap-y-16">
                {#each features as feature}
                    <div class="relative pl-9">
                        <dt class="text-h4 font-montserrat text-ivory">
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
                            {feature.name}
                        </dt>
                        {#if feature.description}
                            <dd class="mt-2 text-p font-sourceSans text-flannel">{feature.description}</dd>
                        {/if}
                    </div>
                {/each}
            </dl>
        </div>
    </div>
</div>