import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import type { ComponentProps } from 'svelte';
import CoursePricingPlans from '../CoursePricingPlans.svelte';
import { BaseTestUtilsFactory } from './utils/baseTestUtils';

// Types
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  most_popular?: boolean;
}

interface Course {
  id: string;
  pricing_plans: PricingPlan[];
}

type Props = ComponentProps<CoursePricingPlans>;

// Test Configuration
const TEST_CONFIG = {
  SELECTORS: {
    CONTAINER: '[data-testid="pricing-section"]',
    PLAN_CARD: '[data-testid="pricing-plan-card"]',
    PRICE_DISPLAY: '[data-testid="price-display"]',
    FEATURE_LIST: '[data-testid="feature-list"]',
    PLAN_DESCRIPTION: '.text-p.leading-6.text-flannel'
  },
  CLASSES: {
    selected: {
      badge: 'bg-cerulean',
      text: 'text-cerulean'
    }
  },
  TEXTS: {
    EMPTY_STATE: 'No pricing plans available',
    PRICING_HEADER: 'Choose your plan',
    CHOOSE_PLAN: 'Select the perfect plan for your needs',
    MOST_POPULAR: 'Most Popular',
    MONTHLY_SUFFIX: '/month',
    GET_STARTED: 'Get Started'
  }
} as const;

class CoursePricingTestUtils extends BaseTestUtilsFactory<
  ReturnType<typeof createDomQueries>,
  ReturnType<typeof createVerifications>,
  ReturnType<typeof createTestData>
> {
  constructor() {
    super(TEST_CONFIG);
  }

  protected createDomQueries = () => ({
    pricing: {
      getContainer: () => screen.getByTestId('pricing-section'),
      getPlanCards: () => screen.getAllByTestId('pricing-plan-card'),
      getPlanByName: (name: string) => {
        const heading = screen.queryByRole('heading', { name });
        if (!heading) {
          throw new Error(`Heading with name "${name}" not found`);
        }
        const card = heading.closest(TEST_CONFIG.SELECTORS.PLAN_CARD);
        if (!card) {
          throw new Error(`Plan card for "${name}" not found`);
        }
        return card as HTMLElement;
      },
      getPriceByPlan: (name: string) => {
        const card = this.queries.pricing.getPlanByName(name);
        const price = card.querySelector(TEST_CONFIG.SELECTORS.PRICE_DISPLAY);
        if (!price) {
          throw new Error(`Price display for plan "${name}" not found`);
        }
        return price as HTMLElement;
      },
      getFeatureList: (name: string) => {
        const card = this.queries.pricing.getPlanByName(name);
        const list = card.querySelector(TEST_CONFIG.SELECTORS.FEATURE_LIST);
        if (!list) {
          throw new Error(`Feature list for plan "${name}" not found`);
        }
        return list as HTMLElement;
      }
    }
  });

  protected createVerifications = () => ({
    pricing: {
      planDetails: (plan: PricingPlan) => {
        try {
          const card = this.queries.pricing.getPlanByName(plan.name);
          expect(card).toBeInTheDocument();
          expect(card).toHaveTextContent(plan.description);
          
          const priceElement = this.queries.pricing.getPriceByPlan(plan.name);
          expect(priceElement).toHaveTextContent(`$${Math.floor(plan.price / 100)}`);
        } catch (error) {
          console.error('Plan details verification failed:', error);
          console.log('Current DOM:', screen.debug());
          throw error;
        }
      },
      featureList: (planName: string, features: string[]) => {
        const list = this.queries.pricing.getFeatureList(planName);
        features.forEach(feature => {
          expect(list).toHaveTextContent(feature);
        });
      }
    }
  });

  protected createTestData = createTestData;

  private get queries() {
    return this.createDomQueries();
  }
}

// Helper functions
const createDomQueries = () => ({
  pricing: {
    getContainer: () => screen.getByTestId('pricing-section'),
    getPlanCards: () => screen.getAllByTestId('pricing-plan-card'),
    getPlanByName: (name: string) => 
      screen.getByRole('heading', { name }).closest(TEST_CONFIG.SELECTORS.PLAN_CARD),
    getPriceByPlan: (name: string) => {
      const card = screen.getByRole('heading', { name }).closest(TEST_CONFIG.SELECTORS.PLAN_CARD);
      return card?.querySelector(TEST_CONFIG.SELECTORS.PRICE_DISPLAY);
    },
    getFeatureList: (name: string) => {
      const card = screen.getByRole('heading', { name }).closest(TEST_CONFIG.SELECTORS.PLAN_CARD);
      return card?.querySelector(TEST_CONFIG.SELECTORS.FEATURE_LIST);
    }
  }
});

const createVerifications = () => ({
  planDetails: (plan: PricingPlan) => {
    const card = screen.getByRole('heading', { name: plan.name }).closest(TEST_CONFIG.SELECTORS.PLAN_CARD);
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent(plan.description);
    expect(card.querySelector(TEST_CONFIG.SELECTORS.PRICE_DISPLAY))
      .toHaveTextContent(`$${Math.floor(plan.price / 100)}`);
  },
  featureList: (planName: string, features: string[]) => {
    const card = screen.getByRole('heading', { name: planName }).closest(TEST_CONFIG.SELECTORS.PLAN_CARD);
    const list = card?.querySelector(TEST_CONFIG.SELECTORS.FEATURE_LIST);
    features.forEach(feature => {
      expect(list).toHaveTextContent(feature);
    });
  }
});

const createTestData = () => {
  const createMonthlyPlan = (overrides: Partial<PricingPlan> = {}): PricingPlan => ({
    id: 'monthly',
    name: 'Monthly Plan',
    price: 2900,
    description: 'Perfect for getting started',
    features: ['Feature 1', 'Feature 2'],
    ...overrides
  });

  const createAnnualPlan = (overrides: Partial<PricingPlan> = {}): PricingPlan => ({
    id: 'annual',
    name: 'Annual Plan',
    price: 29900,
    description: 'Best value for long term',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    most_popular: true,
    ...overrides
  });

  return {
    plans: {
      monthly: createMonthlyPlan(),
      annual: createAnnualPlan()
    },
    helpers: {
      createMonthlyPlan,
      createAnnualPlan
    }
  };
};

// Create and initialize utils
const utils = new CoursePricingTestUtils().create();

describe('CoursePricingPlans', () => {
  describe('Basic Rendering', () => {
    it('renders pricing plans correctly', async () => {
      const course = {
        id: 'test-course',
        pricing_plans: [utils.testData.plans.monthly]
      };

      render(CoursePricingPlans, { course });

      // Debug output
      console.log('Monthly Plan:', utils.testData.plans.monthly);
      console.log('Current DOM:', screen.debug());

      // Wait for any potential async rendering
      await new Promise(resolve => setTimeout(resolve, 0));

      utils.verify.pricing.planDetails(utils.testData.plans.monthly);
    });
  });
}); 