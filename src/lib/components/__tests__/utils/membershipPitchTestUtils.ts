import { screen } from '@testing-library/svelte';
import type { ComponentProps } from '$lib/types';
import type MembershipPitch from '../../MembershipPitch.svelte';

export const membershipPitchTestUtils = {
  testIds: {
    container: 'membership-pitch',
    logo: 'membership-logo',
    content: 'membership-content'
  } as const,

  selectors: {
    outer: '.bg-kohl',
    inner: '.bg-gray-800',
    container: '.max-w-3xl',
    flex: '.flex',
    text: '.text-sm',
    logoContainer: '.flex-shrink-0',
    contentContainer: '.flex-1'
  } as const,

  classes: {
    outer: ['p-8'],
    inner: ['text-white', 'p-4', 'rounded-lg', 'shadow-md'],
    container: ['mx-auto'],
    flex: ['items-center', 'space-x-4'],
    logo: ['h-8', 'w-8', 'text-blue-400'],
    text: ['text-sm']
  } as const,

  createProps: (overrides?: Partial<ComponentProps<typeof MembershipPitch>>): ComponentProps<typeof MembershipPitch> => ({
    membershipInfo: 'Test membership info',
    logoUrl: '/test-logo.png',
    linkUrl: 'https://example.com',
    isDarkMode: false,
    ...overrides
  }),

  queries: {
    getLinks: () => screen.getAllByRole('link', { name: 'Membership link' }),
    getLogo: () => screen.getByRole('img', { name: 'Logo' }),
    getTextLink: () => screen.getAllByRole('link', { name: 'Membership link' })
      .find(link => link.querySelector('.flex-1.text-sm')),
    getLogoLink: () => screen.getAllByRole('link', { name: 'Membership link' })
      .find(link => link.querySelector('.flex-shrink-0')),
    getMembershipInfo: () => screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('Test membership info');
    }),
    getTabbableElements: () => Array.from(
      document.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ),
  },

  verify: {
    classes: (element: HTMLElement | null, expectedClasses: string[]) => {
      expect(element).toBeInTheDocument();
      expectedClasses.forEach(className => {
        expect(element).toHaveClass(className);
      });
    },
    
    linkAttributes: (link: HTMLElement) => {
      expect(link).toHaveAttribute('aria-label', 'Membership link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    },

    darkMode: (container: HTMLElement) => {
      const innerDiv = container.querySelector('.bg-gray-800');
      expect(innerDiv).toHaveClass('text-white');
      expect(innerDiv).toHaveClass('bg-gray-800');
    },

    layout: (container: HTMLElement) => {
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('items-center', 'space-x-4');
      
      const logoContainer = container.querySelector('.flex-shrink-0');
      expect(logoContainer).toBeInTheDocument();
      
      const contentContainer = container.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
    },

    contrast: (container: HTMLElement) => {
      const textElements = container.querySelectorAll('.text-white');
      textElements.forEach(element => {
        const backgroundColor = getComputedStyle(element).backgroundColor;
        const color = getComputedStyle(element).color;
        // Basic contrast check - in real app use a proper contrast checker
        expect(backgroundColor).not.toBe(color);
      });
    }
  }
}; 