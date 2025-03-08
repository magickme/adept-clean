<script lang="ts">
  import type { ModalProps } from '../types/FeaturedTeacher';
  import { onMount, onDestroy } from 'svelte';

  const props = $props();
  const { title, message, buttonText, onClose } = props;

  let dialogElement: HTMLElement | null = $state(null);
  let isVisible = $state(false);

  // Focus management
  $effect(() => {
    if (dialogElement && isVisible) {
      queueMicrotask(() => {
        const focusableElement = dialogElement?.querySelector('button');
        focusableElement?.focus();
      });
    }
  });

  // Visibility sync
  $effect(() => {
    isVisible = props.open;
  });

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Add keydown handler for Escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if isVisible}
  <div
    class="fixed inset-0 z-10 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    bind:this={dialogElement}
  >
    <button
      type="button"
      class="fixed inset-0 bg-kohl/75 transition-opacity"
      onclick={onClose}
      aria-label="Close modal"
      data-testid="modal-backdrop"
    ></button>

    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-kohl px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ring-1 ring-ivory/10"
        role="document"
      >
        <div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-h4 text-ivory font-montserrat" id="modal-title" data-testid="modal-title">
              {title}
            </h3>
            <div class="mt-2">
              <p class="text-p text-flannel font-sourceSans">{@html message}</p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-cerulean px-3 py-2 text-p text-ivory shadow-sm hover:bg-corsair focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerulean font-montserrat"
            onclick={onClose}
            data-testid="modal-close-button"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  button.fixed {
    background: rgba(7, 4, 2, 0.85); /* kohl with higher opacity for better contrast */
  }
  button.fixed:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 163, 220, 0.7); /* cerulean with higher opacity */
  }
</style> 