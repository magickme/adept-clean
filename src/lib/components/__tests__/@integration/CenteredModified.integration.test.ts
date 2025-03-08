import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CenteredModified from '../../CenteredModified.svelte';
import { tick } from 'svelte';

describe('CenteredModified Integration', () => {
  let mockObserverInstance: any;
  let mockCallback: (entries: IntersectionObserverEntry[]) => void;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    disconnectSpy = vi.fn();

    // Create MockIntersectionObserver class
    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        mockCallback = callback;
        mockObserverInstance = this;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnectSpy;
    }

    // Create the mock constructor function
    const mockConstructor = vi.fn().mockImplementation((callback) => {
      return new MockIntersectionObserver(callback);
    });

    // Assign the mock constructor
    global.IntersectionObserver = mockConstructor as unknown as typeof IntersectionObserver;

    // Mock video element methods
    Object.defineProperties(HTMLMediaElement.prototype, {
      play: { configurable: true, value: vi.fn().mockResolvedValue(undefined) },
      pause: { configurable: true, value: vi.fn() },
      muted: { configurable: true, value: true, writable: true },
      src: { configurable: true, value: '', writable: true }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    mockObserverInstance = null;
    mockCallback = null;
    disconnectSpy = null!;
  });

  it('renders title and subtitle correctly', () => {
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      dataTestid: 'centered-modified'
    };

    const { getByText, getByTestId } = render(CenteredModified, { props });

    expect(getByText(props.title)).toBeInTheDocument();
    expect(getByText(props.subtitle)).toBeInTheDocument();
    expect(getByTestId(props.dataTestid)).toBeInTheDocument();
  });

  it('handles video playback based on intersection', async () => {
    const props = {
      title: 'Test',
      subtitle: 'Test',
      videoUrl: 'test.mp4'
    };

    const { container } = render(CenteredModified, { props });
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    // Simulate intersection
    mockCallback([{
      isIntersecting: true,
      target: video!,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    }]);

    // Advance timers to process any asynchronous operations
    await vi.runAllTimersAsync();

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // Simulate leaving viewport
    mockCallback([{
      isIntersecting: false,
      target: video!,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    }]);

    // Advance timers to process any asynchronous operations
    await vi.runAllTimersAsync();

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('toggles video mute state correctly', async () => {
    const props = {
      title: 'Test',
      subtitle: 'Test',
      videoUrl: 'test.mp4'
    };

    const { container } = render(CenteredModified, { props });
    const muteButton = container.querySelector('button');
    expect(muteButton).toBeInTheDocument();

    // Initial mute state should be true
    const video = container.querySelector('video');
    expect(video?.muted).toBe(true);

    await fireEvent.click(muteButton!);
    await vi.runAllTimersAsync();
    expect(video?.muted).toBe(false);

    await fireEvent.click(muteButton!);
    await vi.runAllTimersAsync();
    expect(video?.muted).toBe(true);
  });

  it('cleans up observers on unmount', async () => {
    const { container, unmount } = render(CenteredModified, {
      props: {
        title: 'Test',
        subtitle: 'Test',
        videoUrl: 'test.mp4'
      }
    });

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    // Wait for initial setup
    await tick();
    await vi.runAllTimersAsync();

    // Ensure IntersectionObserver was instantiated and observe was called
    expect(mockObserverInstance.observe).toHaveBeenCalledWith(video);

    // Simulate intersection to ensure observer is active
    mockCallback([{
      isIntersecting: true,
      target: video!,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    }]);

    // Wait for intersection effects
    await tick();
    await vi.runAllTimersAsync();

    // Clear any previous calls
    disconnectSpy.mockClear();

    // Trigger unmount and wait for cleanup
    unmount();
    
    // Wait for cleanup effects
    await tick();
    await vi.runAllTimersAsync();
    await Promise.resolve();
    await tick();

    // Verify that disconnect was called during cleanup
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('handles video errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const props = {
      title: 'Test',
      subtitle: 'Test',
      videoUrl: 'test.mp4'
    };

    const { container } = render(CenteredModified, { props });
    const video = container.querySelector('video');

    // Mock play to reject with an error
    const playError = new Error('Video playback failed');
    HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(playError);

    // Trigger intersection to start playback
    mockCallback([{
      isIntersecting: true,
      target: video!,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    }]);

    // Advance timers to process asynchronous play call
    await vi.runAllTimersAsync();

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error playing video:', playError);

    consoleSpy.mockRestore();
  });

  it('properly cleans up video resources on unmount', async () => {
    const props = {
      title: 'Test',
      subtitle: 'Test',
      videoUrl: 'test.mp4'
    };

    const { container, unmount } = render(CenteredModified, { props });
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    // Trigger unmount
    unmount();
    await tick();
    await vi.runAllTimersAsync();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(video?.src).toBe('');
  });
}); 