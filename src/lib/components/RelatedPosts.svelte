<script lang="ts">
    let { relatedPosts } = $props<{ relatedPosts: any[] }>();

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function truncateText(text: string = '', maxLength: number): string {
        return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text || '';
    }

    function getAuthorName(post: any): string {
        return post?.author?.name || '';
    }

    function getAuthorImage(post: any): string {
        return post?.author?.profile_image || '';
    }

    function getReadingTime(post: any): string {
        return post?.reading_time ? `${post.reading_time} min read` : '';
    }
</script>

<div data-testid="RelatedPosts" class="bg-kohl py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-h2 text-ivory font-montserrat">
                Browse related articles
            </h2>
            <p class="mt-2 text-p text-flannel font-sourceSans">
                Learn more about our magical journey and insights.
            </p>
        </div>
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {#each relatedPosts as post}
                <article class="flex flex-col items-start">
                    <div class="relative w-full">
                        <img
                            src={post.feature_image || ''}
                            alt={post.title || ''}
                            class="aspect-[16/9] w-full rounded-2xl bg-flannel/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                        />
                        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-flannel/10"></div>
                    </div>
                    <div class="max-w-xl">
                        <div class="mt-8 flex items-center gap-x-4 text-cap">
                            <time datetime={post.published_at} class="text-flannel font-sourceSans">
                                {formatDate(post.published_at)}
                            </time>
                            {#each post.tags as tag}
                                <a
                                    href={`/blog/tag/${tag}`}
                                    class="relative z-10 rounded-full bg-cerulean px-3 py-1.5 text-ivory hover:bg-corsair font-montserrat"
                                >
                                    {tag}
                                </a>
                            {/each}
                        </div>
                        <div class="group relative">
                            <h3 class="mt-3 text-h4 text-ivory group-hover:text-cerulean font-montserrat">
                                <a href={`/blog/${post.slug || ''}`}>
                                    <span class="absolute inset-0"></span>
                                    {post.title || ''}
                                </a>
                            </h3>
                            <p class="mt-5 text-p text-flannel font-sourceSans">
                                {truncateText(post.excerpt, 100)}
                            </p>
                        </div>
                        <div class="relative mt-8 flex items-center gap-x-4">
                            <img 
                                src={getAuthorImage(post)} 
                                alt="" 
                                class="h-10 w-10 rounded-full bg-flannel/10"
                                width="40"
                                height="40" 
                            />
                            <div class="text-p leading-6">
                                <p class="font-montserrat text-ivory">
                                    <a href={`/blog/author/${getAuthorName(post)}`}>
                                        <span class="absolute inset-0"></span>
                                        {getAuthorName(post)}
                                    </a>
                                </p>
                                <p class="text-flannel font-sourceSans">
                                    {getReadingTime(post)}
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            {/each}
        </div>
    </div>
</div>