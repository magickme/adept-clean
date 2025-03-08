import { describe, test, expect } from 'vitest';
import { membershipPitchTestUtils } from '../membershipPitchTestUtils';

describe('membershipPitchTestUtils', () => {
  describe('test ids and selectors', () => {
    test('provides test ids', () => {
      expect(membershipPitchTestUtils.testIds.container).toBe('membership-pitch');
      expect(membershipPitchTestUtils.testIds.logo).toBe('membership-logo');
      expect(membershipPitchTestUtils.testIds.content).toBe('membership-content');
    });

    test('provides selectors', () => {
      expect(membershipPitchTestUtils.selectors.outer).toBe('.bg-kohl');
      expect(membershipPitchTestUtils.selectors.inner).toBe('.bg-gray-800');
      expect(membershipPitchTestUtils.selectors.container).toBe('.max-w-3xl');
    });
  });

  describe('queries', () => {
    test('provides link queries', () => {
      expect(membershipPitchTestUtils.queries.getLinks).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.queries.getTextLink).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.queries.getLogoLink).toBeInstanceOf(Function);
    });

    test('provides content queries', () => {
      expect(membershipPitchTestUtils.queries.getLogo).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.queries.getMembershipInfo).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.queries.getTabbableElements).toBeInstanceOf(Function);
    });
  });

  describe('verifications', () => {
    test('provides verification methods', () => {
      expect(membershipPitchTestUtils.verify.classes).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.verify.linkAttributes).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.verify.darkMode).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.verify.layout).toBeInstanceOf(Function);
      expect(membershipPitchTestUtils.verify.contrast).toBeInstanceOf(Function);
    });
  });
}); 