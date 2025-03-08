import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import type { SvelteComponent } from 'svelte';
import BlogVideoPromo from '../BlogVideoPromo.svelte';
import { createVideoMocks, createObserverMocks, waitForPromises, waitForNextTick, flushPromises } from './utils/testHelpers';

describe('BlogVideoPromo', () => {
  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    videoUrl: 'test-video.mp4',
    dataTestid: 'video-promo',
    ctaText: 'Learn More',
    ctaLink: 'https://example.com'
  };

  let videoMocks: ReturnType<typeof createVideoMocks>;
  let observerMocks: ReturnType<typeof createObserverMocks>;

  beforeEach(() => {
    videoMocks = createVideoMocks();
    observerMocks = createObserverMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props = mockProps) => {
    return render(BlogVideoPromo as unknown as new () => SvelteComponent, { props });
  };

  describe('rendering', () => {
    it('renders component with all props', () => {
      renderComponent();
      
      expect(screen.getByText(mockProps.title)).toBeInTheDocument();
      expect(screen.getByText(mockProps.subtitle)).toBeInTheDocument();
      expect(screen.getByText(mockProps.ctaText)).toBeInTheDocument();
      
      const video = screen.getByTestId('video-promo').querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', mockProps.videoUrl);
    });
  });

  describe('video behavior', () => {
    it('plays video when intersecting', async () => {
      const { component } = renderComponent();
      await flushPromises();
      
      // Simulate video ready
      const video = screen.getByLabelText('Promotional video');
      await fireEvent(video, new Event('loadedmetadata'));
      
      observerMocks.simulateIntersection(true);
      await flushPromises();
      
      expect(videoMocks.play).toHaveBeenCalled();
    });

    it('pauses video when not intersecting', async () => {
      renderComponent();
      await flushPromises();
      
      const video = screen.getByLabelText('Promotional video');
      await fireEvent(video, new Event('loadedmetadata'));
      
      observerMocks.simulateIntersection(false);
      await flushPromises();
      
      expect(videoMocks.pause).toHaveBeenCalled();
    });

    it('handles video play errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      videoMocks.play.mockRejectedValueOnce(new Error('Play failed'));
      
      renderComponent();
      await flushPromises();
      
      const video = screen.getByLabelText('Promotional video');
      await fireEvent(video, new Event('loadedmetadata'));
      
      observerMocks.simulateIntersection(true);
      await flushPromises();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error playing video:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('interactions', () => {
    it('toggles mute state when mute button is clicked', async () => {
      renderComponent();
      
      const muteButton = screen.getByText('🔇');
      await fireEvent.click(muteButton);
      expect(screen.getByText('🔊')).toBeInTheDocument();
      
      await fireEvent.click(screen.getByText('🔊'));
      expect(screen.getByText('🔇')).toBeInTheDocument();
    });

    it('navigates to correct URL when CTA button is clicked', () => {
      const mockLocation = { assign: vi.fn() };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });
      
      renderComponent();
      fireEvent.click(screen.getByText(mockProps.ctaText));
      
      expect(mockLocation.assign).toHaveBeenCalledWith(mockProps.ctaLink);
    });
  });

  describe('accessibility', () => {
    it('meets accessibility requirements', () => {
      const { container } = renderComponent();
      
      const video = container.querySelector('video');
      expect(video).toHaveAttribute('playsinline');
      expect(video?.muted).toBe(true);
      
      const track = video?.querySelector('track');
      expect(track).toHaveAttribute('kind', 'captions');
      expect(track).toHaveAttribute('srclang', 'en');
    });
  });

  describe('error states', () => {
    it('handles missing videoUrl gracefully', () => {
      const propsWithoutVideo = { ...mockProps, videoUrl: '' };
      renderComponent(propsWithoutVideo);
      expect(screen.queryByLabelText('Video section')).not.toBeInTheDocument();
    });

    it('handles missing ctaLink gracefully', async () => {
      const mockLocation = { assign: vi.fn() };
      Object.defineProperty(window, 'location', { value: mockLocation, writable: true });
      
      const propsWithoutCta = { ...mockProps, ctaLink: '' };
      renderComponent(propsWithoutCta);
      await fireEvent.click(screen.getByText(mockProps.ctaText));
      expect(mockLocation.assign).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('properly cleans up observer and video state on unmount', () => {
      const { unmount } = renderComponent();
      observerMocks.simulateIntersection(true);
      unmount();
      expect(videoMocks.pause).toHaveBeenCalled();
      expect(observerMocks.disconnect).toHaveBeenCalled();
    });
  });

  describe('video error handling', () => {
    it('displays error message when video fails to load', async () => {
      renderComponent();
      
      const video = screen.getByLabelText('Promotional video');
      const errorEvent = new ErrorEvent('error', {
        error: new Error('Failed to load video'),
        message: 'Failed to load video'
      });
      
      await fireEvent(video, errorEvent);
      expect(screen.getByText(/Unable to load video/)).toBeInTheDocument();
    });

    it('displays specific error message when video fails', async () => {
      renderComponent();
      
      const video = screen.getByLabelText('Promotional video');
      const mediaError = { code: 4, message: 'MEDIA_ERR_SRC_NOT_SUPPORTED' };
      Object.defineProperty(video, 'error', { value: mediaError });
      
      await fireEvent(video, new ErrorEvent('error'));
      expect(screen.getByText(/MEDIA_ERR_SRC_NOT_SUPPORTED/)).toBeInTheDocument();
    });

    it('allows retrying when video fails', async () => {
      renderComponent();
      
      const video = screen.getByLabelText('Promotional video');
      await fireEvent(video, new ErrorEvent('error'));
      
      const retryButton = screen.getByText('Retry');
      await fireEvent.click(retryButton);
      
      expect(videoMocks.load).toHaveBeenCalled();
      expect(screen.queryByText(/Unable to load video/)).not.toBeInTheDocument();
    });
  });

  describe('derived state', () => {
    it('correctly derives isVideoPlayable state', async () => {
      const { unmount } = renderComponent();
      await flushPromises();
      
      const video = screen.getByLabelText('Promotional video');
      await fireEvent(video, new Event('loadedmetadata'));
      
      observerMocks.simulateIntersection(false);
      await flushPromises();
      expect(videoMocks.play).not.toHaveBeenCalled();
      
      observerMocks.simulateIntersection(true);
      await flushPromises();
      expect(videoMocks.play).toHaveBeenCalled();
      
      unmount();
    });
  });
}); 