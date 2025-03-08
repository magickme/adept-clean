import { describe, test, expect, vi } from 'vitest';
import { blogVideoPromoTestUtils } from '../blogVideoPromoTestUtils';
import { createVideoMocks, createObserverMocks } from '../testHelpers';

describe('blogVideoPromoTestUtils', () => {
  describe('video and observer mocks', () => {
    test('creates video mocks with required methods', () => {
      const mocks = createVideoMocks();
      expect(mocks.play).toBeInstanceOf(Function);
      expect(mocks.pause).toBeInstanceOf(Function);
      expect(typeof mocks.muted).toBe('boolean');
    });

    test('creates observer mocks with required methods', () => {
      const mocks = createObserverMocks();
      expect(mocks.observe).toBeInstanceOf(Function);
      expect(mocks.unobserve).toBeInstanceOf(Function);
      expect(mocks.disconnect).toBeInstanceOf(Function);
      expect(mocks.simulateIntersection).toBeInstanceOf(Function);
    });
  });

  describe('test utils', () => {
    const utils = blogVideoPromoTestUtils;

    test('provides correct selectors', () => {
      expect(utils.config.selectors.video).toBe('video');
      expect(utils.config.selectors.muteButton).toBe('mute-button');
      expect(utils.config.selectors.container).toBe('video-promo');
    });

    test('provides dom queries', () => {
      expect(utils.dom.video.getVideo).toBeInstanceOf(Function);
      expect(utils.dom.video.getMuteButton).toBeInstanceOf(Function);
      expect(utils.dom.video.getTrack).toBeInstanceOf(Function);
    });

    test('provides verifications', () => {
      expect(utils.verify.basicStructure).toBeInstanceOf(Function);
      expect(utils.verify.muteState).toBeInstanceOf(Function);
      expect(utils.verify.accessibility).toBeInstanceOf(Function);
    });
  });
}); 