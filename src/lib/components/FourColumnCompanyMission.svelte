<script lang="ts">
    import logo from '$lib/assets/logos/magickme_title_cerulean.svg';
    import defaultFooterData from '$lib/collections/footer/links.json';
  
    const { dataTestid = '', footerData = defaultFooterData } = $props();
  
    const currentYear = new Date().getFullYear();
  
    const { socialLinks = [], footerColumns = [] } = footerData;

    interface SocialLink {
        name: string;
        href: string;
        icon: string;
        newTab?: boolean;
    }

    interface FooterItem {
        name: string;
        href: string;
        newTab?: boolean;
    }

    interface FooterColumn {
        title: string;
        items: FooterItem[];
    }
</script>
  
{#snippet socialIcon({ name, href, icon, newTab }: SocialLink)}
    <a {href} class="text-ivory hover:text-cerulean" target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : ""}>
        <span class="sr-only">{name}</span>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d={icon} clip-rule="evenodd" />
        </svg>
    </a>
{/snippet}
  
{#snippet footerColumn({ title, items }: FooterColumn)}
    <div class={title !== 'Solutions' ? 'mt-10 md:mt-0' : ''}>
        <h3 class="text-h4 text-ivory font-montserrat">{title}</h3>
        <ul role="list" class="mt-6 space-y-4">
            {#each items as { name, href, newTab }}
                <li>
                    <a {href} class="text-cap text-ivory hover:text-cerulean font-sourceSans" target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : ""}>{name}</a>
                </li>
            {/each}
        </ul>
    </div>
{/snippet}
  
<footer class="bg-kohl" aria-labelledby="footer-heading" data-testid={dataTestid}>
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
            <div class="space-y-8">
                <img 
                    class="h-7" 
                    src={logo} 
                    alt="Magick.Me Logo"
                    width="140"
                    height="28" 
                />
                <p class="text-sm leading-6 text-ivory font-sourceSans">Making the world a better place by democratizing access to spirituality.</p>
                <div class="flex space-x-6">
                    {#each socialLinks as link}
                        {@render socialIcon(link)}
                    {/each}
                </div>
            </div>
            <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div class="md:grid md:grid-cols-2 md:gap-8">
                    {@render footerColumn(footerColumns[0])}
                    {@render footerColumn(footerColumns[2])}
                </div>
            </div>
        </div>
        <div class="mt-16 border-t border-ivory/10 pt-8 sm:mt-20 lg:mt-24">
            <p class="text-cap text-ivory font-sourceSans">© {currentYear} Ultraculture Inc. All rights reserved.</p>
        </div>
    </div>
</footer>