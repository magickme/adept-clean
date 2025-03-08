import { describe, test, expect } from 'vitest';
import { 
  TEST_CONSTANTS,
  createTestPricingPlans,
  DEFAULT_COURSE,
  PricingSelectors,
  PricingClasses,
  createCustomPlan,
  createCustomCourse
} from '../pricingTestUtils';

describe('pricingTestUtils', () => {
  describe('TEST_CONSTANTS', () => {
    test('provides valid text constants', () => {
      expect(TEST_CONSTANTS.TEXTS.MOST_POPULAR).toBe('Most popular');
      expect(TEST_CONSTANTS.TEXTS.GET_STARTED).toBe('Get started');
      expect(TEST_CONSTANTS.PRICES.MONTHLY).toBe('$29');
    });

    test('provides valid scenarios', () => {
      expect(TEST_CONSTANTS.SCENARIOS.MONTHLY.PLAN_COUNT).toBe(1);
      expect(TEST_CONSTANTS.SCENARIOS.MULTIPLE_PLANS.PLAN_COUNT).toBe(2);
    });
  });

  describe('createTestPricingPlans', () => {
    test('creates default plans', () => {
      const plans = createTestPricingPlans();
      expect(plans.monthly).toBeDefined();
      expect(plans.annual).toBeDefined();
      expect(plans.annual.most_popular).toBe(true);
    });

    test('allows overrides', () => {
      const plans = createTestPricingPlans({
        monthly: { price: 3900 }
      });
      expect(plans.monthly.price).toBe(3900);
      expect(plans.annual.price).toBe(29900);
    });
  });

  describe('createCustomPlan/Course', () => {
    test('creates custom plan with defaults', () => {
      const plan = createCustomPlan({ name: 'Custom' });
      expect(plan.name).toBe('Custom');
      expect(plan.features).toEqual(TEST_CONSTANTS.FEATURES.BASIC);
    });

    test('creates custom course with defaults', () => {
      const course = createCustomCourse({ id: 'custom' });
      expect(course.id).toBe('custom');
      expect(course.pricing_plans).toHaveLength(1);
    });
  });
}); 