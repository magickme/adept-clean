<script lang="ts">
    interface Course {
        id: string;
        name: string;
        image_url: string;
        author: string;
        author_image: string;
        skill_level: string;
        duration: string;
        link?: string;
    }

    let { 
        tagMap, 
        selectedTab: initialSelectedTab = $bindable(), 
        displayCourses = []
    } = $props<{
        tagMap: Record<string, string>;
        selectedTab: string;
        displayCourses: Course[];
    }>();

    let selectedTab = $state(initialSelectedTab);
    let filteredCourses = $derived(
        selectedTab === 'All' 
            ? displayCourses 
            : displayCourses.filter((course: Course) => course.skill_level === selectedTab)
    );

    $effect(() => {
        initialSelectedTab = selectedTab;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('tab', tagMap[selectedTab].toLowerCase());
        try {
            window.history.replaceState(
                null,
                '',
                `${window.location.pathname}?${searchParams.toString()}`
            );
        } catch (e) {
            console.error('Failed to update URL:', e);
        }
    });

    function updateSelectedTab(tabName: string) {
        selectedTab = tabName;
    }
</script>

<div class="py-12 bg-kohl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="border-b border-gray-700">
            <nav class="flex space-x-8" aria-label="Tabs">
                {#each Object.keys(tagMap) as tabName}
                    <button
                        class={`${
                            selectedTab === tabName
                                ? 'border-cerulean text-cerulean'
                                : 'border-transparent text-flannel text-bold hover:border-flannel hover:text-ivory'
                        } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-montserrat font-medium`}
                        aria-current={selectedTab === tabName ? 'page' : undefined}
                        aria-selected={selectedTab === tabName}
                        role="tab"
                        data-testid={`tab-${tabName.toLowerCase()}`}
                        onclick={() => updateSelectedTab(tabName)}
                    >
                        {tabName}
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <div class="mt-8" data-testid="three-column-background-images">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-0 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {#each filteredCourses as course (course.id)}
                    <article class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80" style="height: 500px;">
                        <img 
                            src={course.image_url} 
                            alt={course.name} 
                            class="absolute inset-0 -z-10 h-full w-full object-cover"
                            width="800"
                            height="600"
                        >
                        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
                        <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

                        <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                            <div class="mr-8">
                                <img 
                                    class="h-7 w-7 rounded-full bg-gray-800 object-cover" 
                                    src={course.author_image} 
                                    alt={course.author}
                                    width="28"
                                    height="28"
                                >
                            </div>
                            <div class="-ml-4 flex items-center gap-x-4">
                                <svg viewBox="0 0 2 2" class="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                                    <circle cx="1" cy="1" r="1" />
                                </svg>
                                <div class="flex gap-x-2.5">
                                    {course.author}
                                </div>
                            </div>
                        </div>
                        <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
                            {#if course.link}
                                <a href={course.link}>
                                    <span class="absolute inset-0"></span>
                                    {@html course.name}
                                </a>
                            {:else}
                                {@html course.name}
                            {/if}
                        </h3>
                        <div class="mt-2 flex items-center gap-x-4 text-xs">
                            <div class="flex items-center gap-x-1">
                                <span class="text-gray-400">{course.skill_level}</span>
                            </div>
                            <div class="flex items-center gap-x-1">
                                <span class="text-gray-400">{course.duration}</span>
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-12 text-center">
        <a href="/courses" class="inline-block rounded-md bg-cerulean px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cerulean-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean">
            Explore Courses
        </a>
    </div>
</div>