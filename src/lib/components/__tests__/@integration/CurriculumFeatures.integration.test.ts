import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import CurriculumFeatures from '../../CurriculumFeatures.svelte';

describe('CurriculumFeatures Integration', () => {
  const mockData = {
    curriculum_head: {
      prehead: "What's included",
      title: "Everything you need to know",
      description: "Comprehensive curriculum covering all aspects"
    },
    curriculum_features: [
      {
        name: "Feature 1",
        description: "Description 1"
      },
      {
        name: "Feature 2",
        description: "Description 2"
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders curriculum head content correctly', () => {
    render(CurriculumFeatures, { props: { data: mockData } });

    expect(screen.getByText(mockData.curriculum_head.prehead)).toBeInTheDocument();
    expect(screen.getByText(mockData.curriculum_head.title)).toBeInTheDocument();
    expect(screen.getByText(mockData.curriculum_head.description)).toBeInTheDocument();
  });

  it('renders all curriculum features with icons', () => {
    render(CurriculumFeatures, { props: { data: mockData } });

    mockData.curriculum_features.forEach(feature => {
      const featureElement = screen.getByText(feature.name);
      expect(featureElement).toBeInTheDocument();
      
      // Check that each feature has an icon
      const icon = featureElement.closest('dt')?.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-cerulean');
    });
  });

  it('handles missing description in curriculum head', () => {
    const dataWithoutDesc = {
      ...mockData,
      curriculum_head: {
        prehead: mockData.curriculum_head.prehead,
        title: mockData.curriculum_head.title
      }
    };

    render(CurriculumFeatures, { props: { data: dataWithoutDesc } });
    
    expect(screen.getByText(dataWithoutDesc.curriculum_head.title)).toBeInTheDocument();
    // Description element should not be rendered
    const descriptions = screen.queryAllByText(mockData.curriculum_head.description);
    expect(descriptions).toHaveLength(0);
  });

  it('handles missing feature descriptions', () => {
    const dataWithoutFeatureDesc = {
      ...mockData,
      curriculum_features: [
        { name: "Feature 1" },
        { name: "Feature 2", description: "Description 2" }
      ]
    };

    render(CurriculumFeatures, { props: { data: dataWithoutFeatureDesc } });

    // Feature without description should still render name
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    // Feature with description should render both
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it('applies correct responsive classes', () => {
    const { container } = render(CurriculumFeatures, { props: { data: mockData } });

    // Check grid layout classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');

    // Check feature list grid classes
    const featureList = container.querySelector('dl');
    expect(featureList).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
  });

  it('maintains accessibility attributes', () => {
    const { container } = render(CurriculumFeatures, { props: { data: mockData } });

    // Icons should be decorative
    const icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    // Feature names should be in description terms
    mockData.curriculum_features.forEach(feature => {
      const term = screen.getByText(feature.name).closest('dt');
      expect(term).toBeInTheDocument();
    });
  });

  it('handles empty features array gracefully', () => {
    const dataWithNoFeatures = {
      ...mockData,
      curriculum_features: []
    };

    const { container } = render(CurriculumFeatures, { props: { data: dataWithNoFeatures } });

    // Header content should still render
    expect(screen.getByText(mockData.curriculum_head.title)).toBeInTheDocument();
    
    // Features section should be empty but not break
    const featureList = container.querySelector('dl');
    expect(featureList?.children).toHaveLength(0);
  });

  it('handles null or undefined curriculum features gracefully', () => {
    const dataWithNullFeatures = {
      curriculum_head: mockData.curriculum_head,
      curriculum_features: null
    };

    const { container } = render(CurriculumFeatures, { props: { data: dataWithNullFeatures } });
    
    // Header should render
    expect(screen.getByText(mockData.curriculum_head.title)).toBeInTheDocument();
    
    // Features section should be empty but not break
    const featureList = container.querySelector('dl');
    expect(featureList?.children).toHaveLength(0);
  });

  it('preserves feature order as provided in data', () => {
    const orderedFeatures = [
      { name: "Last Feature", description: "Should be last" },
      { name: "First Feature", description: "Should be first" },
      { name: "Middle Feature", description: "Should be in middle" }
    ];

    const dataWithOrderedFeatures = {
      ...mockData,
      curriculum_features: orderedFeatures
    };

    render(CurriculumFeatures, { props: { data: dataWithOrderedFeatures } });

    const featureElements = screen.getAllByText(/Feature$/);
    expect(featureElements.map(el => el.textContent?.trim())).toEqual([
      "Last Feature",
      "First Feature", 
      "Middle Feature"
    ]);
  });
}); 