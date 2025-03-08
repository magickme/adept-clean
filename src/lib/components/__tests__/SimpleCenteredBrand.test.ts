// SimpleCenteredBrand.test.ts
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SimpleCenteredBrand from '../SimpleCenteredBrand.svelte';

describe('SimpleCenteredBrand', () => {
  const mockProps = {
    dataTestid: 'custom-brand',
    title: 'Custom Title',
    ctaText: 'Get Started',
    ctaHref: '/signup',
    trailerText: 'View Demo',
    trailerHref: '/demo'
  };

  describe('rendering', () => {
    it('renders with default props', () => {
      render(SimpleCenteredBrand);
      
      expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Watch Trailer')).toBeInTheDocument();
    });

    it('renders with custom props', () => {
      render(SimpleCenteredBrand, { props: mockProps });
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('View Demo')).toBeInTheDocument();
    });

    it('applies correct link attributes', () => {
      render(SimpleCenteredBrand, { props: mockProps });
      
      const cta = screen.getByTestId('custom-brand-cta');
      const trailer = screen.getByTestId('custom-brand-trailer');
      
      expect(cta).toHaveAttribute('href', '/signup');
      expect(trailer).toHaveAttribute('href', '/demo');
    });
  });

  describe('styling', () => {
    it('applies correct base classes', () => {
      render(SimpleCenteredBrand);
      
      const cta = screen.getByTestId('simple-centered-brand-cta');
      const trailer = screen.getByTestId('simple-centered-brand-trailer');
      
      expect(cta).toHaveClass('text-sm', 'font-semibold', 'transition-all');
      expect(trailer).toHaveClass('text-sm', 'font-semibold', 'transition-all');
    });

    it('applies correct container classes', () => {
      render(SimpleCenteredBrand);
      
      const section = screen.getByTestId('simple-centered-brand');
      expect(section.querySelector('.bg-cerulean')).toBeInTheDocument();
      expect(section.querySelector('.rounded-lg')).toBeInTheDocument();
    });

    it('applies hover states correctly', async () => {
      render(SimpleCenteredBrand);
      
      const cta = screen.getByTestId('simple-centered-brand-cta');
      const trailer = screen.getByTestId('simple-centered-brand-trailer');
      
      expect(cta).toHaveClass('hover:bg-gray-200');
      expect(trailer).toHaveClass('hover:text-opacity-90');
    });

    it('applies transition classes correctly', () => {
      render(SimpleCenteredBrand);
      
      const cta = screen.getByTestId('simple-centered-brand-cta');
      const trailer = screen.getByTestId('simple-centered-brand-trailer');
      const icon = screen.getByTestId('trailer-icon');
      
      expect(cta).toHaveClass('transition-all', 'duration-200');
      expect(trailer).toHaveClass('transition-all', 'duration-200');
      expect(icon).toHaveClass('transition-transform', 'duration-200');
    });
  });

  describe('accessibility', () => {
    it('uses proper ARIA attributes', () => {
      render(SimpleCenteredBrand);
      
      const section = screen.getByTestId('simple-centered-brand');
      const title = screen.getByRole('heading', { level: 2 });
      const icon = screen.getByTestId('trailer-icon');
      
      expect(section).toHaveAttribute('aria-labelledby', 'brand-title');
      expect(title).toHaveAttribute('id', 'brand-title');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('includes screen reader text', () => {
      render(SimpleCenteredBrand);
      
      expect(screen.getByText('Watch our trailer video')).toHaveClass('sr-only');
    });

    it('has proper keyboard navigation', async () => {
      const user = userEvent.setup();
      render(SimpleCenteredBrand);
      
      const cta = screen.getByTestId('simple-centered-brand-cta');
      const trailer = screen.getByTestId('simple-centered-brand-trailer');
      
      await user.tab();
      expect(cta).toHaveFocus();
      
      await user.tab();
      expect(trailer).toHaveFocus();
    });

    it('shows focus indicators on keyboard navigation', async () => {
      const user = userEvent.setup();
      render(SimpleCenteredBrand);
      
      const cta = screen.getByTestId('simple-centered-brand-cta');
      
      await user.tab();
      expect(cta).toHaveClass('focus-visible:outline', 'focus-visible:outline-2');
    });
  });

  describe('edge cases', () => {
    it('handles empty strings in props', () => {
      render(SimpleCenteredBrand, {
        props: { ...mockProps, title: '', ctaText: '', trailerText: '' }
      });
      
      const title = screen.getByTestId('custom-brand-title');
      const cta = screen.getByTestId('custom-brand-cta');
      const trailer = screen.getByTestId('custom-brand-trailer');
      
      expect(title).toHaveTextContent('');
      expect(cta).toHaveTextContent('');
      
      // Get visible text content excluding sr-only elements and trim whitespace
      const visibleText = Array.from(trailer.childNodes)
        .filter(node => {
          // Keep text nodes and non-sr-only elements
          return (node.nodeType === Node.TEXT_NODE) || 
                 (node instanceof HTMLElement && !node.classList.contains('sr-only'));
        })
        .map(node => node.textContent?.trim() || '')
        .join('')
        .trim();
      
      expect(visibleText).toBe('');
    });

    it('handles missing href props', () => {
      render(SimpleCenteredBrand, {
        props: { ...mockProps, ctaHref: undefined, trailerHref: undefined }
      });
      
      const cta = screen.getByTestId('custom-brand-cta');
      const trailer = screen.getByTestId('custom-brand-trailer');
      
      expect(cta).toHaveAttribute('href', '#');
      expect(trailer).toHaveAttribute('href', '#');
    });
  });
});