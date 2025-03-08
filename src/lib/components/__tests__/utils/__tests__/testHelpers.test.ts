import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createVideoMocks, createObserverMocks, waitForPromises, waitForNextTick, flushPromises } from '../testHelpers';

describe('testHelpers', () => {
  describe('createVideoMocks', () => {
    let videoMocks: ReturnType<typeof createVideoMocks>;

    beforeEach(() => {
      videoMocks = createVideoMocks();
    });

    test('creates mock video methods', () => {
      expect(videoMocks.play).toBeInstanceOf(Function);
      expect(videoMocks.pause).toBeInstanceOf(Function);
      expect(videoMocks.load).toBeInstanceOf(Function);
    });

    test('play returns a promise', async () => {
      await expect(videoMocks.play()).resolves.toBeUndefined();
    });

    test('muted property is configurable', () => {
      const video = document.createElement('video');
      expect(video.muted).toBe(true);
      video.muted = false;
      expect(video.muted).toBe(false);
    });
  });

  describe('createObserverMocks', () => {
    let observerMocks: ReturnType<typeof createObserverMocks>;

    beforeEach(() => {
      observerMocks = createObserverMocks();
    });

    test('creates IntersectionObserver mock', () => {
      expect(window.IntersectionObserver).toBeDefined();
      expect(observerMocks.observe).toBeInstanceOf(Function);
      expect(observerMocks.unobserve).toBeInstanceOf(Function);
      expect(observerMocks.disconnect).toBeInstanceOf(Function);
    });

    test('simulates intersection', () => {
      const callback = vi.fn();
      new IntersectionObserver(callback);
      
      observerMocks.simulateIntersection(true);
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ isIntersecting: true })
        ]),
        expect.any(Object)
      );
    });
  });

  describe('timing utilities', () => {
    test('waitForPromises resolves', async () => {
      const promise = waitForPromises();
      await expect(promise).resolves.toBeUndefined();
    });

    test('waitForNextTick resolves', async () => {
      const promise = waitForNextTick();
      await expect(promise).resolves.toBeUndefined();
    });

    test('flushPromises resolves', async () => {
      const promise = flushPromises();
      await expect(promise).resolves.toBeUndefined();
    });

    test('timing sequence works correctly', async () => {
      const sequence: string[] = [];
      
      Promise.resolve().then(() => sequence.push('promise'));
      requestAnimationFrame(() => sequence.push('raf'));
      setTimeout(() => sequence.push('timeout'), 0);
      
      await flushPromises();
      
      expect(sequence).toEqual(['promise', 'timeout', 'raf']);
    });
  });
}); 