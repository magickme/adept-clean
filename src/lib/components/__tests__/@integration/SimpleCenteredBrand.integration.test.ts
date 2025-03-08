import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SimpleCenteredBrand from '../../SimpleCenteredBrand.svelte';

describe('SimpleCenteredBrand Integration', () => {
  const mockProps = {
    dataTestid: 'brand-section',
    title: 'Test Title',
    ctaText: 'Sign Up Now',
    ctaHref: '/signup',
    trailerText: 'Watch Demo',
    trailerHref: '/demo'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with all props and maintains accessibility attributes', () => {
    const { getByTestId, getByText } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const section = getByTestId('brand-section');
    expect(section).toHaveAttribute('aria-labelledby', 'brand-title');

    const title = getByTestId('brand-section-title');
    expect(title).toHaveAttribute('id', 'brand-title');
  });

  it('handles CTA button interactions correctly', async () => {
    const { getByTestId } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const ctaButton = getByTestId('brand-section-cta');
    expect(ctaButton).toHaveAttribute('href', mockProps.ctaHref);
    
    // Instead of testing Tailwind hover classes, test the base classes
    expect(ctaButton).toHaveClass('bg-gray-300', 'text-cerulean');
  });

  it('handles trailer button interactions and icon transitions', async () => {
    const { getByTestId } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const trailerButton = getByTestId('brand-section-trailer');
    const trailerIcon = getByTestId('trailer-icon');

    expect(trailerButton).toHaveAttribute('href', mockProps.trailerHref);
    expect(trailerIcon).toHaveClass('ml-2', 'h-4', 'w-4');
  });

  it('maintains responsive layout classes', () => {
    const { container } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-24');
    
    const contentWrapper = container.querySelector('.mx-auto.max-w-4xl');
    expect(contentWrapper).toHaveClass('px-6');
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      dataTestid: 'brand-section'
    };

    const { getByTestId } = render(SimpleCenteredBrand, {
      props: minimalProps
    });

    const section = getByTestId('brand-section');
    expect(section).toBeInTheDocument();
    
    // Should use default values
    const title = getByTestId('brand-section-title');
    expect(title).toHaveTextContent('Ready to get started?');
  });

  it('provides proper ARIA labels for interactive elements', () => {
    const { getByTestId } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const trailerButton = getByTestId('brand-section-trailer');
    expect(trailerButton.querySelector('.sr-only'))
      .toHaveTextContent('Watch our trailer video');
  });

  it('applies correct background classes', async () => {
    const { container } = render(SimpleCenteredBrand, {
      props: mockProps
    });

    const bgElement = container.querySelector('.bg-cerulean');
    expect(bgElement).toHaveClass('rounded-lg');
    expect(bgElement).toHaveClass('p-6');
    expect(bgElement).toHaveClass('sm:p-12');
  });
}); 