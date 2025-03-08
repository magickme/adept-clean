import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import WithCards from '../../WithCards.svelte';

describe('WithCards Integration', () => {
  const mockUnits = [
    {
      icon: '🚀',
      name: 'Unit 1',
      description: 'Description 1'
    },
    {
      icon: '⭐',
      name: 'Unit 2',
      description: 'Description 2'
    }
  ];

  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    units: mockUnits,
    isDarkMode: false,
    isLoading: false,
    error: undefined
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and description correctly', () => {
    const { getByText } = render(WithCards, {
      props: mockProps
    });

    const title = getByText(mockProps.title);
    expect(title).toBeInTheDocument();

    const description = getByText(mockProps.description);
    expect(description).toBeInTheDocument();
  });

  it('renders all units with correct content', () => {
    const { getByText } = render(WithCards, {
      props: mockProps
    });

    mockUnits.forEach(unit => {
      expect(getByText(unit.name)).toBeInTheDocument();
      expect(getByText(unit.description)).toBeInTheDocument();
    });
  });

  it('applies correct theme classes based on isDarkMode', async () => {
    const { container, rerender } = render(WithCards, {
      props: { ...mockProps, isDarkMode: false }
    });

    const lightBgElement = container.querySelector('.bg-gray-900');
    expect(lightBgElement).toBeInTheDocument();

    await rerender({ ...mockProps, isDarkMode: true });

    const darkBgElement = container.querySelector('.bg-black');
    expect(darkBgElement).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    const { container } = render(WithCards, {
      props: { ...mockProps, isLoading: true }
    });

    const loadingElements = container.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('handles empty units array gracefully', () => {
    const propsWithNoUnits = {
      ...mockProps,
      units: []
    };

    const { queryAllByRole } = render(WithCards, {
      props: propsWithNoUnits
    });

    const listItems = queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('renders error message when error prop is provided', () => {
    const errorProps = {
      ...mockProps,
      error: 'An error occurred'
    };

    const { getByText } = render(WithCards, {
      props: errorProps
    });

    const errorMessage = getByText(errorProps.error);
    expect(errorMessage).toBeInTheDocument();
  });
}); 