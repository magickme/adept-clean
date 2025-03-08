<script lang="ts">
    import { onMount } from 'svelte';
    
    interface FamousMagesData {
      title: string;
      description: string;
      categories: Record<string, string[]>;
    }
    
    let data = $state<FamousMagesData>({
      title: '',
      description: '',
      categories: {}
    });
    
    onMount(async () => {
      const response = await fetch('/src/lib/collections/social-proof/famousMages.json');
      const jsonData = await response.json();
      
      if (jsonData.categories['Military'] && jsonData.categories['Film & Television']) {
        const temp = jsonData.categories['Military'];
        jsonData.categories['Military'] = jsonData.categories['Film & Television'];
        jsonData.categories['Film & Television'] = temp;
      }
      
      data = jsonData;
    });
  </script>
  
  <div class="relative bg-kohl py-24 sm:py-32 overflow-hidden">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-kohl via-corsair to-cerulean opacity-90 mix-blend-multiply"></div>
      <img
        src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
        alt="Magical night sky with aurora borealis"
        class="w-full h-full object-cover opacity-40"
        width="2560"
        height="1440"
      />
    </div>
    <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-none">
        <h2 class="text-4xl font-bold tracking-tight text-ivory sm:text-5xl text-center mb-8 font-montserrat">
          {data.title}
        </h2>
        
        <p class="mb-16 max-w-3xl mx-auto text-center text-gray-200 text-lg font-sourceSans">
          {data.description}
        </p>
        
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {#each Object.entries(data.categories || {}) as [category, items]}
            <div 
              class="group bg-kohl/40 p-8 rounded-xl backdrop-blur-md border border-cerulean/20 
              hover:border-cerulean/60 transition-all duration-300 hover:shadow-lg hover:shadow-cerulean/20"
            >
              <h3 class="text-2xl font-semibold mb-6 text-cerulean font-montserrat group-hover:text-ivory transition-colors duration-300">
                {category}
              </h3>
              <ul class="space-y-3">
                {#each items as item}
                  <li class="text-gray-300 hover:text-ivory transition-colors duration-200 font-sourceSans flex items-center">
                    <span class="text-cerulean mr-2">•</span>
                    {item}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>