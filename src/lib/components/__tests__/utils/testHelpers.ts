import { vi, type Mock } from 'vitest';

export interface VideoMocks {
  play: Mock;
  pause: Mock;
  muted: boolean;
  load: Mock;
}

export interface ObserverMocks {
  observer: Mock;
  observe: Mock;
  unobserve: Mock;
  disconnect: Mock;
  simulateIntersection: (isIntersecting: boolean) => void;
}

export const createVideoMocks = (): VideoMocks => {
  let muted = true;
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  const load = vi.fn();

  Object.defineProperties(HTMLMediaElement.prototype, {
    play: { configurable: true, get: () => play },
    pause: { configurable: true, get: () => pause },
    load: { configurable: true, get: () => load },
    muted: {
      configurable: true,
      get: () => muted,
      set: (value) => { muted = value; }
    }
  });

  return { play, pause, load, muted };
};

export const createObserverMocks = (): ObserverMocks => {
  let intersectionCallback: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  
  const observer = vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
    intersectionCallback = callback;
    return { observe, unobserve, disconnect };
  });

  window.IntersectionObserver = observer;

  const simulateIntersection = (isIntersecting: boolean) => {
    intersectionCallback(
      [{ isIntersecting, target: document.createElement('div') }],
      {} as IntersectionObserver
    );
  };

  return { 
    observer, 
    observe, 
    unobserve, 
    disconnect, 
    simulateIntersection 
  };
};

export const waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0));

export const waitForNextTick = () => new Promise(resolve => {
  requestAnimationFrame(() => {
    setTimeout(resolve, 0);
  });
});

export const flushPromises = async () => {
  await Promise.resolve();
  await new Promise(resolve => setTimeout(resolve, 0));
  await new Promise(resolve => requestAnimationFrame(resolve));
};