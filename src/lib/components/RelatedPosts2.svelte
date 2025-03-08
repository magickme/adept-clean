<script lang="ts">
    let { posts } = $props();

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function truncateText(text: string, maxLength: number): string {
        if (!text) return '';
        return text.length <= maxLength ? text : text.substr(0, maxLength) + '...';
    }
</script>

{#if posts && posts.length > 0}
    <div data-testid="RelatedPosts" class="bg-kohl py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-h2 text-ivory font-montserrat">From the blog</h2>
                <p class="mt-2 text-p text-flannel font-sourceSans">Learn more about our magical journey and insights.</p>
            </div>
            <div class="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {#each posts as post}
                    <article class="relative isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-kohl px-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
                        <img 
                            src={post.imageUrl} 
                            alt="" 
                            class="absolute inset-0 -z-10 h-full w-full object-cover"
                            width="800"
                            height="600" 
                        />
                        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-kohl/50 via-kohl/20"></div>
                        <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-ivory/10"></div>

                        <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-cap text-flannel">
                            <time datetime={post.datetime} class="mr-8 font-sourceSans">{post.date}</time>
                            <div class="-ml-4 flex items-center gap-x-4">
                                <svg viewBox="0 0 2 2" class="-ml-0.5 h-0.5 w-0.5 flex-none fill-ivory/50">
                                    <circle cx="1" cy="1" r="1" />
                                </svg>
                                <div class="flex gap-x-2.5 font-sourceSans">
                                    <img 
                                        src={post.author.imageUrl} 
                                        alt="" 
                                        class="h-6 w-6 flex-none rounded-full bg-ivory/10"
                                        width="24"
                                        height="24" 
                                    />
                                    {post.author.name}
                                </div>
                            </div>
                        </div>
                        <h3 class="mt-3 text-h4 text-ivory font-montserrat">
                            <a href={post.href}>
                                <span class="absolute inset-0"></span>
                                {post.title}
                            </a>
                        </h3>
                    </article>
                {/each}
            </div>
        </div>
    </div>
{/if}