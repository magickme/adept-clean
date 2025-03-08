import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CoursePricingPlans from '../../CoursePricingPlans.svelte';
import type { Course } from '$lib/types/course';
import { formatPrice, getCheckoutUrl } from '$lib/utils/pricing';

// Mock the pricing utils
vi.mock('$lib/utils/pricing', () => ({
  formatPrice: vi.fn((price: number) => price.toFixed(2)),
  getCheckoutUrl: vi.fn((courseId: string, plan: any) => `/checkout/${courseId}/${plan.id}`)
}));

// Update the type for course with no pricing plans
const courseWithoutPlans: Course = {
  id: 'course-123',
  description: 'Test Course Description',
  pricing_plans: [] // Use empty array instead of undefined
};

describe('CoursePricingPlans Integration', () => {
  const mockCourse: Course = {
    id: 'course-123',
    description: 'Test Course Description',
    pricing_plans: [
      {
        id: 'basic',
        name: 'Basic Plan',
        description: 'Basic features',
        price: 29.99,
        features: ['Feature 1', 'Feature 2'],
        most_popular: false,
        slug: 'monthly'
      }
    ]
  };

  const renderComponent = (customProps: Partial<Course> = {}) => {
    return render(CoursePricingPlans, {
      props: { 
        course: { ...mockCourse, ...customProps }
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all pricing plans with correct layout', () => {
    const { getAllByTestId, getAllByRole } = renderComponent();

    const planCards = getAllByTestId('pricing-plan-card');
    expect(planCards).toHaveLength(1);
    
    // Check accessibility roles
    expect(getAllByRole('article')).toHaveLength(1);
    expect(getAllByRole('list')).toHaveLength(1);
  });

  it('displays "Most popular" badge for popular plans', () => {
    const courseWithPopularPlan = {
      ...mockCourse,
      pricing_plans: [{
        ...mockCourse.pricing_plans[0],
        most_popular: true
      }]
    };

    const { getByText } = render(CoursePricingPlans, {
      props: { course: courseWithPopularPlan }
    });

    expect(getByText('Most popular')).toBeInTheDocument();
  });

  it('displays formatted prices correctly', () => {
    const { getAllByTestId } = renderComponent();

    const priceDisplays = getAllByTestId('price-display');
    expect(priceDisplays[0].textContent).toContain('29.99');
    expect(formatPrice).toHaveBeenCalledTimes(1);
  });

  it('renders correct feature lists for each plan', () => {
    const { getAllByTestId } = renderComponent();

    const featureLists = getAllByTestId('feature-list');
    expect(featureLists[0].querySelectorAll('li')).toHaveLength(2);
  });

  it('generates correct checkout URLs for each plan', async () => {
    const { getAllByText } = renderComponent();

    const startButtons = getAllByText('Get started');
    
    for (let i = 0; i < startButtons.length; i++) {
      const button = startButtons[i];
      const plan = mockCourse.pricing_plans[i];
      
      expect(button.closest('a')).toHaveAttribute(
        'href',
        `/checkout/${mockCourse.id}/${plan.id}`
      );
    }

    expect(getCheckoutUrl).toHaveBeenCalledTimes(1);
  });

  it('handles course with no pricing plans gracefully', () => {
    const { getByText } = render(CoursePricingPlans, {
      props: { course: courseWithoutPlans }
    });

    expect(getByText('No pricing information available for this course')).toBeInTheDocument();
  });

  it('displays correct billing period indicators', () => {
    const { getByText, getAllByTestId } = renderComponent();

    const priceDisplays = getAllByTestId('price-display');
    expect(priceDisplays[0].parentElement?.textContent).toContain('/month');
  });

  it('maintains responsive layout classes', () => {
    const { getAllByTestId } = renderComponent();

    const cards = getAllByTestId('pricing-plan-card');
    expect(cards[0]).toHaveClass('lg:rounded-r-none'); // First card
  });

  it('sanitizes HTML in feature descriptions', () => {
    const courseWithHtml = {
      ...mockCourse,
      pricing_plans: [{
        ...mockCourse.pricing_plans[0],
        features: ['<script>alert("xss")</script>Safe feature']
      }]
    };

    const { getAllByTestId } = render(CoursePricingPlans, {
      props: { course: courseWithHtml }
    });

    const featureLists = getAllByTestId('feature-list');
    const featureText = featureLists[0].textContent?.trim();
    
    expect(featureText).toContain('Safe feature');
    expect(featureText).not.toContain('alert("xss")');
    expect(featureLists[0].querySelector('script')).toBeNull();
  });

  it('ensures all interactive elements are keyboard accessible', () => {
    const { getAllByText } = renderComponent();
    
    const startButtons = getAllByText('Get started');
    startButtons.forEach(button => {
      const link = button.closest('a');
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-describedby');
    });
  });

  it('includes proper ARIA labels for features lists', () => {
    const { getAllByRole } = renderComponent();
    
    const featureLists = getAllByRole('list');
    featureLists.forEach((list, index) => {
      const planName = mockCourse.pricing_plans[index].name;
      expect(list).toHaveAttribute('aria-label', `Features for ${planName}`);
    });
  });
}); 