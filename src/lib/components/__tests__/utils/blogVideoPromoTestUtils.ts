import { screen, fireEvent } from '@testing-library/svelte';
import { expect, vi } from 'vitest';
import type { ComponentType } from 'svelte';
import BlogVideoPromo from '../../BlogVideoPromo.svelte';
import { createComponentTestUtils } from './componentTestUtils';
import type { ComponentTestConfig } from './componentTestUtils';

// Types
interface BlogVideoPromoProps {
  title: string;
  subtitle: string;
  videoUrl: string;
  dataTestid?: string;
  ctaText: string;
  ctaLink: string;
}

interface BlogVideoPromoConfig extends ComponentTestConfig<
  typeof Selectors,
  typeof Classes
> {
  selectors: typeof Selectors;
  classes: typeof Classes;
}

// Constants
const Selectors = {
  video: 'video',
  muteButton: 'mute-button',
  container: 'video-promo'
} as const;

const Classes = {
  button: {
    base: 'absolute bottom-4 right-4'
  }
} as const;

// Mock Factories
export const createVideoMocks = () => {
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  let muted = true;

  Object.defineProperties(HTMLMediaElement.prototype, {
    play: { configurable: true, get: () => play },
    pause: { configurable: true, get: () => pause },
    muted: {
      configurable: true,
      get: () => muted,
      set: (value) => { muted = value; }
    }
  });

  return { play, pause, muted };
};

export const createObserverMocks = () => {
  let callback: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIntersectionObserver implements IntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
    takeRecords = vi.fn(() => []);
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: readonly number[] = [];
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  return {
    observe,
    unobserve,
    disconnect,
    simulateIntersection: (isIntersecting: boolean) => {
      callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    }
  };
};

// Test Utils Factory
export const blogVideoPromoTestUtils = createComponentTestUtils<
  typeof BlogVideoPromo,
  BlogVideoPromoProps,
  BlogVideoPromoConfig
>({
  component: BlogVideoPromo,
  config: {
    selectors: Selectors,
    classes: Classes
  },
  defaultProps: {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    videoUrl: 'test-video.mp4',
    dataTestid: 'video-promo',
    ctaText: 'Learn More',
    ctaLink: 'https://example.com'
  },
  createDomQueries: (config) => ({
    video: {
      getVideo: () => screen.getByTestId(config.selectors.container).querySelector('video'),
      getMuteButton: () => screen.getByRole('button'),
      getTrack: () => screen.getByTestId(config.selectors.container).querySelector('track'),
      getTitle: () => screen.getByRole('heading', { level: 1 }),
      getSubtitle: () => screen.getByTestId(config.selectors.container).querySelector('.text-p')
    }
  }),
  createActions: () => ({
    async toggleMute() {
      const muteButton = screen.getByRole('button');
      await fireEvent.click(muteButton);
    },
    async clickCTA() {
      const link = screen.getByRole('link');
      await fireEvent.click(link);
    }
  }),
  createVerifications: (config) => ({
    basicStructure: () => {
      const video = screen.getByTestId(config.selectors.container).querySelector('video');
      const muteButton = screen.getByRole('button');
      const track = video?.querySelector('track');

      expect(video).toBeInTheDocument();
      expect(muteButton).toBeInTheDocument();
      expect(track).toBeInTheDocument();
      expect(track).toHaveAttribute('kind', 'captions');
      expect(track).toHaveAttribute('srclang', 'en');
    },
    muteState: (isMuted: boolean) => {
      const video = screen.getByTestId(config.selectors.container).querySelector('video');
      const muteButton = screen.getByRole('button');

      expect(video?.muted).toBe(isMuted);
      expect(muteButton).toHaveTextContent(isMuted ? '🔇' : '🔊');
    },
    accessibility: () => {
      const video = screen.getByTestId(config.selectors.container).querySelector('video');
      const muteButton = screen.getByRole('button');

      expect(video).toHaveAttribute('playsinline');
      expect(muteButton).toHaveClass(config.classes.button.base);
      expect(muteButton).toBeVisible();
    }
  }),
  createTestData: () => ({
    errors: {
      playback: new Error('Playback failed')
    },
    html: {
      simple: '<strong>Bold</strong> text',
      complex: '<strong>Bold</strong> <em>italic</em> text',
      nested: '<div><strong>Nested</strong> <span>content</span></div>'
    }
  })
}); 