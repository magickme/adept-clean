import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TwoColumnsPhoto from '../TwoColumnsPhoto.svelte';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('TwoColumnsPhoto', () => {
  test('renders with default props', () => {
    render(TwoColumnsPhoto);
    
    expect(screen.getByText("What's in every Magick.Me subscription?")).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/path/to/your/triangle-image.jpg');
  });

  test('renders all default features', () => {
    render(TwoColumnsPhoto);
    
    const defaultFeatures = [
      'All 30+ classes and office hours',
      'Audio-only lessons',
      'Download & watch offline (select plans)',
      'Downloadable course workbooks', 
      'Watch on desktop, TV or mobile devices',
      'New classes added daily!'
    ];

    defaultFeatures.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test('renders image with correct attributes', () => {
    const customProps = {
      imageSrc: '/test-image.jpg',
      imageAlt: 'Test alt text'
    };

    render(TwoColumnsPhoto, { props: customProps });
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test alt text');
  });

  test('renders with custom props', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom description',
      features: ['Feature 1', 'Feature 2'],
      ctaText: 'Custom CTA',
      ctaHref: '/custom-signup',
      secondaryCtaText: 'Custom Gift',
      secondaryCtaHref: '/custom-gift'
    };

    render(TwoColumnsPhoto, { props: customProps });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    
    const [primaryCta, secondaryCta] = screen.getAllByRole('link');
    expect(primaryCta).toHaveTextContent('Custom CTA');
    expect(secondaryCta).toHaveTextContent('Custom Gift');
  });

  test('renders CTA buttons with correct attributes', () => {
    const customProps = {
      ctaText: 'Custom CTA',
      ctaHref: '/custom-signup',
      secondaryCtaText: 'Custom Gift',
      secondaryCtaHref: '/custom-gift'
    };

    render(TwoColumnsPhoto, { props: customProps });

    const [primaryCta, secondaryCta] = screen.getAllByRole('link');
    expect(primaryCta).toHaveAttribute('href', '/custom-signup');
    expect(secondaryCta).toHaveAttribute('href', '/custom-gift');
  });

  test('meets accessibility requirements', () => {
    render(TwoColumnsPhoto);
    
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  test('handles empty features array', () => {
    render(TwoColumnsPhoto, { props: { features: [] }});
    const list = document.querySelector('ul');
    expect(list?.children.length).toBe(0);
  });

  test('handles missing optional props', () => {
    render(TwoColumnsPhoto, { 
      props: {
        title: undefined,
        description: undefined,
        ctaText: undefined,
        secondaryCtaText: undefined
      }
    });
    
    // Component should still render without errors
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('buttons show correct hover states', async () => {
    render(TwoColumnsPhoto);
    
    const [primaryCta, secondaryCta] = screen.getAllByRole('link');
    
    await fireEvent.mouseOver(primaryCta);
    expect(primaryCta).toHaveClass('hover:bg-corsair');
    
    await fireEvent.mouseOver(secondaryCta);
    expect(secondaryCta).toHaveClass('hover:bg-corsair');
  });

  test('buttons show correct focus states', async () => {
    render(TwoColumnsPhoto);
    
    const [primaryCta, secondaryCta] = screen.getAllByRole('link');
    
    await userEvent.tab(); // Focus first button
    expect(primaryCta).toHaveFocus();
    expect(primaryCta).toHaveClass('focus-visible:outline-cerulean');
    
    await userEvent.tab(); // Focus second button
    expect(secondaryCta).toHaveFocus();
    expect(secondaryCta).toHaveClass('focus-visible:outline-flannel');
  });

  test('applies correct responsive classes', () => {
    render(TwoColumnsPhoto);
    
    const grid = screen.getByTestId('two-columns-photo')
      .querySelector('.grid');
      
    expect(grid).toHaveClass(
      'grid-cols-1',
      'lg:grid-cols-2'
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass(
      'w-full',
      'max-w-lg',
      'lg:max-w-none'
    );
  });

  test('handles image loading', async () => {
    render(TwoColumnsPhoto);
    
    const image = screen.getByRole('img');
    
    // Simulate image load
    await fireEvent.load(image);
    expect(image).toBeVisible();
    
    // Simulate image error
    await fireEvent.error(image);
    expect(image).toBeInTheDocument(); // Should still be present even if failed to load
  });
}); 