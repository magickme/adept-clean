import type { Course, PricingPlan } from '$lib/types/course';

export const TEST_CONSTANTS = {
  TEXTS: {
    EMPTY_STATE: 'No pricing information available for this course.',
    MOST_POPULAR: 'Most popular',
    GET_STARTED: 'Get started',
    PRICING_HEADER: 'Pricing',
    CHOOSE_PLAN: 'Choose the right plan for you',
    MONTHLY_SUFFIX: '/month'
  },
  PRICES: {
    MONTHLY: '$29',
    ANNUAL: '$299'
  },
  FEATURES: {
    BASIC: ['Feature 1', 'Feature 2'],
    PREMIUM: ['Feature 1', 'Feature 2', 'Feature 3']
  },
  SCENARIOS: {
    MONTHLY: {
      PLAN_COUNT: 1,
      FEATURE_COUNT: 2
    },
    MULTIPLE_PLANS: {
      PLAN_COUNT: 2,
      EXPECTED_PRICES: {
        'Monthly Plan': '$29',
        'Annual Plan': '$299'
      }
    }
  }
} as const;

export const TEST_IDS = {
  PRICING_SECTION: 'pricing-section',
  PLAN_CARD: 'pricing-plan-card',
  PRICE_DISPLAY: 'price-display',
  FEATURE_LIST: 'feature-list',
  PLAN_HEADER: 'plan-header',
  PLAN_DESCRIPTION: 'plan-description'
} as const;

export const createTestPricingPlans = (overrides?: Partial<Record<'monthly' | 'annual', Partial<PricingPlan>>>) => ({
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    description: 'Pay monthly',
    price: 2900,
    features: TEST_CONSTANTS.FEATURES.BASIC,
    slug: 'monthly',
    ...overrides?.monthly
  },
  annual: {
    id: 'annual',
    name: 'Annual Plan',
    description: 'Pay yearly',
    price: 29900,
    features: TEST_CONSTANTS.FEATURES.PREMIUM,
    most_popular: true,
    slug: 'annual',
    ...overrides?.annual
  }
});

export const DEFAULT_COURSE: Readonly<Course> = {
  id: '1',
  description: 'Test Course Description',
  pricing_plans: [createTestPricingPlans().monthly]
} as const;

export const PricingSelectors = {
  pricingSection: TEST_IDS.PRICING_SECTION,
  planCard: TEST_IDS.PLAN_CARD,
  popularBadge: 'most-popular',
  priceText: 'text-h2',
  featureList: TEST_IDS.FEATURE_LIST,
  getStartedButton: TEST_CONSTANTS.TEXTS.GET_STARTED,
  planHeader: TEST_IDS.PLAN_HEADER,
  planDescription: TEST_IDS.PLAN_DESCRIPTION
} as const;

export const PricingClasses = {
  selected: {
    badge: 'bg-cerulean/10',
    text: 'text-cerulean'
  },
  container: {
    base: 'flex flex-col justify-between rounded-3xl bg-white p-8',
    hover: 'hover:bg-corsair'
  },
  text: {
    header: 'text-h4 font-montserrat leading-8 text-corsair',
    description: 'text-p leading-6 text-flannel font-sourceSans'
  }
} as const;

export const createCustomPlan = (overrides: Partial<PricingPlan>): PricingPlan => ({
  ...createTestPricingPlans().monthly,
  ...overrides
});

export const createCustomCourse = (overrides: Partial<Course>): Course => ({
  ...DEFAULT_COURSE,
  ...overrides
}); 