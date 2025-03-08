import { describe, test, expect } from 'vitest';
import { formatPrice, getCheckoutUrl } from '../pricing';

describe('pricing utilities', () => {
  describe('formatPrice', () => {
    test('converts cents to dollars', () => {
      expect(formatPrice(2900)).toBe(29);
      expect(formatPrice(29900)).toBe(299);
    });

    test('handles zero', () => {
      expect(formatPrice(0)).toBe(0);
    });

    test('rounds down decimal values', () => {
      expect(formatPrice(2999)).toBe(29);
    });
  });

  describe('getCheckoutUrl', () => {
    test('generates correct checkout URL', () => {
      const courseId = 'course-123';
      const plan = { id: 'plan-456', price: 2900 };
      
      const url = getCheckoutUrl(courseId, plan);
      
      expect(url).toBe('/checkout?courseId=course-123&planId=plan-456&price=2900');
    });

    test('handles special characters in IDs', () => {
      const courseId = 'course with spaces';
      const plan = { id: 'plan/with/slashes', price: 2900 };
      
      const url = getCheckoutUrl(courseId, plan);
      
      expect(url).toBe('/checkout?courseId=course with spaces&planId=plan/with/slashes&price=2900');
    });
  });
}); 