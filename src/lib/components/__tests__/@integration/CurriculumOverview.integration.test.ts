import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CurriculumOverview from '../../CurriculumOverview.svelte';

describe('CurriculumOverview Integration', () => {
  const mockFeatures = [
    {
      name: 'Feature 1',
      description: 'Description 1'
    },
    {
      name: 'Feature 2',
      description: 'Description 2'
    }
  ];

  const mockCurriculumHead = {
    prehead: 'Test Prehead',
    title: 'Test Title',
    description: 'Test Description'
  };

  const mockProps = {
    curriculumHead: mockCurriculumHead,
    features: mockFeatures
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders curriculum head content correctly', () => {
    const { getByText } = render(CurriculumOverview, {
      props: mockProps
    });

    expect(getByText(mockCurriculumHead.prehead)).toHaveClass('text-cerulean');
    expect(getByText(mockCurriculumHead.title)).toHaveClass('text-ivory');
    expect(getByText(mockCurriculumHead.description)).toHaveClass('text-ivory');
  });

  it('renders all features with correct layout', () => {
    const { container } = render(CurriculumOverview, {
      props: mockProps
    });

    const featureContainers = container.querySelectorAll('.relative.pl-9');
    expect(featureContainers).toHaveLength(mockFeatures.length);

    featureContainers.forEach((container, index) => {
      const term = container.querySelector('dt');
      const description = container.querySelector('dd');
      
      expect(term).toHaveTextContent(mockFeatures[index].name);
      expect(description).toHaveTextContent(mockFeatures[index].description || '');
    });
  });

  it('maintains responsive grid layout classes', () => {
    const { container } = render(CurriculumOverview, {
      props: mockProps
    });

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'gap-x-8',
      'gap-y-16',
      'lg:grid-cols-3'
    );
  });

  it('handles missing optional descriptions gracefully', () => {
    const propsWithoutDesc = {
      curriculumHead: {
        prehead: 'Test Prehead',
        title: 'Test Title'
      },
      features: [
        {
          name: 'Feature 1'
        }
      ]
    };

    const { queryByText } = render(CurriculumOverview, {
      props: propsWithoutDesc
    });

    expect(queryByText(mockCurriculumHead.description)).not.toBeInTheDocument();
  });

  it('renders feature icons consistently', () => {
    const { container } = render(CurriculumOverview, {
      props: mockProps
    });

    const icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveClass('text-cerulean');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('applies correct text styles for different content types', () => {
    const { getByText } = render(CurriculumOverview, {
      props: mockProps
    });

    const prehead = getByText(mockCurriculumHead.prehead);
    expect(prehead).toHaveClass('font-semibold', 'leading-7');

    const title = getByText(mockCurriculumHead.title);
    expect(title).toHaveClass('tracking-tight', 'sm:text-4xl');
  });

  it('handles empty features array gracefully', () => {
    const propsWithNoFeatures = {
      ...mockProps,
      features: []
    };

    const { container } = render(CurriculumOverview, {
      props: propsWithNoFeatures
    });

    const featuresList = container.querySelector('dl');
    expect(featuresList?.children).toHaveLength(0);
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(CurriculumOverview, {
      props: mockProps
    });

    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(mockFeatures.length);
  });

  it('provides proper spacing between features', () => {
    const { container } = render(CurriculumOverview, {
      props: mockProps
    });

    const featureList = container.querySelector('dl');
    expect(featureList).toHaveClass('gap-y-10', 'lg:gap-y-16');
  });
}); 