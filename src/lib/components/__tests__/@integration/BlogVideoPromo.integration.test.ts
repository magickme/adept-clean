import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import BlogVideoPromo from '../../BlogVideoPromo.svelte';

describe('BlogVideoPromo Integration', () => {
  const mockProps = {
    title: 'Test Video',
    subtitle: 'Test Subtitle',
    videoUrl: 'https://test.com/video.mp4',
    dataTestid: 'video-promo',
    ctaText: 'Learn More',
    ctaLink: '/learn'
  } as const;

  type VideoMocks = {
    playMock: ReturnType<typeof vi.fn>;
    pauseMock: ReturnType<typeof vi.fn>;
    loadMock: ReturnType<typeof vi.fn>;
    mutedValue: boolean;
  };

  let intersectionCallback: IntersectionObserverCallback;
  let videoMocks: VideoMocks;
  let observerMocks: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };

  const setupVideoMocks = (): VideoMocks => {
    const mocks = {
      playMock: vi.fn().mockResolvedValue(undefined),
      pauseMock: vi.fn(),
      loadMock: vi.fn(),
      mutedValue: true
    };

    Object.defineProperties(HTMLMediaElement.prototype, {
      load: { configurable: true, value: mocks.loadMock },
      play: { configurable: true, value: mocks.playMock },
      pause: { configurable: true, value: mocks.pauseMock },
      muted: {
        configurable: true,
        get: () => mocks.mutedValue,
        set: (value: boolean) => { mocks.mutedValue = value; }
      }
    });

    return mocks;
  };

  const createIntersectionEntry = (isIntersecting: boolean, target: Element): IntersectionObserverEntry => ({
    isIntersecting,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target,
    time: 0
  });

  const simulateIntersection = async (target: Element, isIntersecting: boolean) => {
    intersectionCallback([createIntersectionEntry(isIntersecting, target)], {} as IntersectionObserver);
    await vi.advanceTimersByTime(100);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    videoMocks = setupVideoMocks();
    cleanup();

    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true,
      configurable: true
    });

    observerMocks = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    };

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = observerMocks.observe;
      unobserve = observerMocks.unobserve;
      disconnect = observerMocks.disconnect;
      takeRecords = () => [];
    }

    global.IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('handles video loading states correctly', async () => {
    const { container, queryByText } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    expect(video?.getAttribute('preload')).toBe('metadata');
    
    expect(queryByText(/loading video/i)).toBeInTheDocument();
    
    await fireEvent(video!, new Event('loadedmetadata'));
    expect(queryByText(/loading video/i)).not.toBeInTheDocument();
  });

  it('manages video playback based on intersection', async () => {
    const { container, unmount } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    await fireEvent(video!, new Event('loadedmetadata'));

    await simulateIntersection(video!, true);
    expect(videoMocks.playMock).toHaveBeenCalled();

    await simulateIntersection(video!, false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    unmount();
  });

  it('handles video errors gracefully with retry', async () => {
    const { container, getByText, queryByText } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    
    await fireEvent(video!, new ErrorEvent('error', { 
      error: new Error('Failed to load video: network error') 
    }));

    expect(getByText(/unable to load video/i)).toBeInTheDocument();
    
    await fireEvent.click(getByText(/retry/i));
    
    expect(queryByText(/unable to load video/i)).not.toBeInTheDocument();
    expect(getByText(/loading video/i)).toBeInTheDocument();
  });

  it('handles mute toggle correctly', async () => {
    const { container } = render(BlogVideoPromo, {
      props: mockProps
    });

    const muteButton = container.querySelector('[aria-label="Unmute video"]');
    if (!muteButton) throw new Error('Mute button not found');
    
    await fireEvent.click(muteButton);
    expect(muteButton.textContent).toContain('🔊');
  });

  it('handles CTA button interaction correctly', async () => {
    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true
    });

    const { container } = render(BlogVideoPromo, {
      props: mockProps
    });

    const ctaButton = container.querySelector('[aria-label="Learn More"]');
    if (!ctaButton) throw new Error('CTA button not found');
    
    await fireEvent.click(ctaButton);
    expect(assignMock).toHaveBeenCalledWith(mockProps.ctaLink);
  });

  it('recovers video playback after error resolution', async () => {
    const { container, getByText, queryByText } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    
    await fireEvent(video!, new ErrorEvent('error', { 
      error: new Error('Network error') 
    }));
    expect(getByText(/unable to load video/i)).toBeInTheDocument();
    
    await fireEvent.click(getByText(/retry/i));
    await fireEvent(video!, new Event('loadedmetadata'));
    
    expect(queryByText(/unable to load video/i)).not.toBeInTheDocument();
    
    await simulateIntersection(video!, true);
    expect(videoMocks.playMock).toHaveBeenCalled();
  });

  it('handles multiple intersection transitions correctly', async () => {
    const { container } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    await fireEvent(video!, new Event('loadedmetadata'));

    await simulateIntersection(video!, true);
    expect(videoMocks.playMock).toHaveBeenCalledTimes(1);

    await simulateIntersection(video!, false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    await simulateIntersection(video!, true);
    expect(videoMocks.playMock).toHaveBeenCalledTimes(2);
  });

  it('cleans up video resources on unmount', async () => {
    const { container, unmount } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    await fireEvent(video!, new Event('loadedmetadata'));
    await simulateIntersection(video!, true);
    
    unmount();
    expect(videoMocks.pauseMock).toHaveBeenCalled();
    expect(observerMocks.disconnect).toHaveBeenCalled();
  });

  it('handles concurrent error and intersection events', async () => {
    const { container, getByText, queryByText } = render(BlogVideoPromo, {
      props: mockProps
    });

    const video = container.querySelector('video');
    await fireEvent(video!, new Event('loadedmetadata'));
    
    // Clear any previous calls
    videoMocks.playMock.mockClear();
    
    // Trigger error before intersection
    await fireEvent(video!, new ErrorEvent('error', { 
      error: new Error('Network error') 
    }));
    
    // Then intersect
    await simulateIntersection(video!, true);

    expect(getByText(/unable to load video/i)).toBeInTheDocument();
    expect(videoMocks.playMock).not.toHaveBeenCalled();
    
    // Retry should work even if still intersecting
    await fireEvent.click(getByText(/retry/i));
    await fireEvent(video!, new Event('loadedmetadata'));
    
    expect(queryByText(/unable to load video/i)).not.toBeInTheDocument();
    expect(videoMocks.playMock).toHaveBeenCalled();
  });
}); 