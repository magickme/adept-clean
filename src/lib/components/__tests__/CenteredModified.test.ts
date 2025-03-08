import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import { userEvent } from '@testing-library/user-event';
import CenteredModified from '../CenteredModified.svelte';
import { createVideoMocks, createObserverMocks, waitForPromises } from './utils/testHelpers';

describe('CenteredModified', () => {
  interface TestProps {
    title: string;
    subtitle: string;
    videoUrl?: string;
    dataTestid?: string;
  }

  const TEST_ERROR = new Error('Playback failed');
  const MINIMAL_PROPS: TestProps = {
    title: 'Minimal Title',
    subtitle: 'Minimal Subtitle'
  };

  const HTML_FIXTURES = {
    SIMPLE: '<strong>Bold</strong> text',
    COMPLEX: '<strong>Bold</strong> <em>italic</em> text',
    NESTED: '<div><strong>Nested</strong> <span>content</span></div>'
  } as const;

  const createComponent = (props: Partial<TestProps> = {}) => {
    const componentProps: TestProps = {
      title: props.title ?? 'Test Title',
      subtitle: props.subtitle ?? 'Test Subtitle',
      ...(props.videoUrl !== undefined && { videoUrl: props.videoUrl }),
      ...(props.dataTestid !== undefined && { dataTestid: props.dataTestid })
    };

    return render(CenteredModified, {
      props: componentProps
    });
  };

  const queryElements = () => ({
    video: screen.queryByTestId('video-element'),
    muteButton: screen.queryByRole('button'),
    heading: screen.getByRole('heading', { level: 1 }),
    subtitle: screen.getByTestId('subtitle-text'),
    track: screen.queryByTestId('video-element')?.querySelector('track')
  });

  let videoMocks: ReturnType<typeof createVideoMocks>;
  let observerMocks: ReturnType<typeof createObserverMocks>;

  beforeEach(() => {
    videoMocks = createVideoMocks();
    observerMocks = createObserverMocks();
  });

  describe('Rendering', () => {
    it('renders minimal version correctly', () => {
      createComponent(MINIMAL_PROPS);
      const elements = queryElements();
      
      expect(elements.heading).toHaveTextContent(MINIMAL_PROPS.title);
      expect(elements.subtitle).toHaveTextContent(MINIMAL_PROPS.subtitle);
      expect(elements.video).not.toBeInTheDocument();
      expect(elements.muteButton).not.toBeInTheDocument();
    });

    it('renders full version correctly', () => {
      createComponent({ videoUrl: 'test-video.mp4' });
      const elements = queryElements();
      
      expect(elements.video).toBeInTheDocument();
      expect(elements.muteButton).toBeInTheDocument();
      expect(elements.track).toBeInTheDocument();
    });

    describe('HTML Content', () => {
      Object.entries(HTML_FIXTURES).forEach(([name, content]) => {
        it(`renders ${name} HTML content correctly`, () => {
          createComponent({ subtitle: content });
          const elements = queryElements();
          expect(elements.subtitle.innerHTML).toContain(content);
        });
      });
    });
  });

  describe('Video Behavior', () => {
    describe('Mute Toggle', () => {
      it('handles mute state correctly', async () => {
        createComponent({ videoUrl: 'test-video.mp4' });
        const elements = queryElements();
        const muteButton = elements.muteButton!;
        const video = elements.video!;

        expect(video.muted).toBe(true);
        expect(muteButton).toHaveTextContent('🔇');

        await userEvent.click(muteButton);
        expect(video.muted).toBe(false);
        expect(muteButton).toHaveTextContent('🔊');

        await userEvent.click(muteButton);
        expect(video.muted).toBe(true);
        expect(muteButton).toHaveTextContent('🔇');
      });
    });

    describe('Intersection Observer', () => {
      it('manages playback correctly', async () => {
        createComponent({ videoUrl: 'test-video.mp4' });
        await waitForPromises();
        
        observerMocks.simulateIntersection(true);
        expect(videoMocks.play).toHaveBeenCalledTimes(1);

        observerMocks.simulateIntersection(false);
        expect(videoMocks.pause).toHaveBeenCalledTimes(1);
      });

      it('handles errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        videoMocks.play.mockRejectedValueOnce(TEST_ERROR);
        
        createComponent({ videoUrl: 'test-video.mp4' });
        await waitForPromises();
        
        observerMocks.simulateIntersection(true);
        await waitForPromises();
        
        expect(consoleSpy).toHaveBeenCalledWith('Error playing video:', TEST_ERROR);
        consoleSpy.mockRestore();
      });
    });
  });

  describe('Accessibility', () => {
    it('meets WCAG requirements', () => {
      createComponent({ videoUrl: 'test-video.mp4' });
      const elements = queryElements();
      
      expect(elements.video).toHaveAttribute('playsinline');
      expect(elements.track).toHaveAttribute('kind', 'captions');
      expect(elements.track).toHaveAttribute('srclang', 'en');
      expect(elements.muteButton).toHaveClass('absolute bottom-4 right-4');
      expect(elements.muteButton).toBeVisible();
      expect(elements.heading).toHaveClass('text-h1');
    });
  });
}); 