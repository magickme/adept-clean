import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ThreeColumnSmallIcons from '../ThreeColumnSmallIcons.svelte';

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: (str: string) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }
}));

describe('ThreeColumnSmallIcons', () => {
  const mockFeatures = [
    {
      icon: '🚀',
      title: 'Feature 1',
      description: 'Description 1',
      linkText: 'Learn More',
      linkUrl: '/feature1'
    },
    {
      icon: '⚡',
      title: 'Feature 2',
      description: 'Description 2',
      linkText: 'Get Started',
      linkUrl: '/feature2'
    },
    {
      icon: '💡',
      title: 'Feature 3',
      description: 'Description 3',
      linkText: 'Explore',
      linkUrl: '/feature3'
    }
  ];

  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
    features: mockFeatures
  };

  describe('rendering', () => {
    it('renders with all props', () => {
      render(ThreeColumnSmallIcons, { props: mockProps });
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders all features correctly', () => {
      render(ThreeColumnSmallIcons, { props: mockProps });

      mockFeatures.forEach(feature => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
        expect(screen.getByText(feature.description)).toBeInTheDocument();
        expect(screen.getByText(feature.linkText)).toBeInTheDocument();
        expect(screen.getByText(feature.icon)).toBeInTheDocument();
      });
    });

    it('renders HTML content in subtitle and description', () => {
      const propsWithHtml = {
        ...mockProps,
        subtitle: '<strong>Bold Subtitle</strong>',
        description: '<em>Italic Description</em>'
      };

      render(ThreeColumnSmallIcons, { props: propsWithHtml });
      
      expect(screen.getByText('Bold Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Italic Description')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies correct container classes', () => {
      const { container } = render(ThreeColumnSmallIcons, { props: mockProps });
      
      expect(container.querySelector('.bg-kohl')).toBeInTheDocument();
      expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
    });

    it('applies correct grid classes for responsive layout', () => {
      const { container } = render(ThreeColumnSmallIcons, { props: mockProps });
      
      const grid = container.querySelector('dl');
      expect(grid).toHaveClass('grid', 'lg:grid-cols-3');
    });

    it('applies correct text classes', () => {
      const { container } = render(ThreeColumnSmallIcons, { props: mockProps });
      
      expect(container.querySelector('.text-5xl')).toBeInTheDocument();
      expect(container.querySelector('.text-3xl')).toBeInTheDocument();
      expect(container.querySelector('.text-p')).toBeInTheDocument();
    });
  });

  describe('links', () => {
    it('renders feature links with correct attributes', () => {
      render(ThreeColumnSmallIcons, { props: mockProps });

      mockFeatures.forEach(feature => {
        const link = screen.getByText(feature.linkText).closest('a');
        expect(link).toHaveAttribute('href', feature.linkUrl);
        expect(link).toHaveClass('text-cerulean');
      });
    });

    it('includes arrow icon in links', () => {
      render(ThreeColumnSmallIcons, { props: mockProps });

      const arrows = screen.getAllByText('→');
      expect(arrows).toHaveLength(mockFeatures.length);
      arrows.forEach(arrow => {
        expect(arrow).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = render(ThreeColumnSmallIcons, { props: mockProps });
      
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('dl')).toBeInTheDocument();
      expect(container.querySelectorAll('dt')).toHaveLength(mockFeatures.length);
      expect(container.querySelectorAll('dd')).toHaveLength(mockFeatures.length);
    });

    it('maintains proper heading hierarchy', () => {
      render(ThreeColumnSmallIcons, { props: mockProps });
      
      const heading = screen.getByText(mockProps.title);
      expect(heading.tagName).toBe('H2');
    });
  });

  describe('edge cases', () => {
    it('handles empty features array', () => {
      const { container } = render(ThreeColumnSmallIcons, { 
        props: { ...mockProps, features: [] } 
      });
      
      const grid = container.querySelector('dl');
      expect(grid?.children).toHaveLength(0);
    });

    it('handles missing optional props', () => {
      render(ThreeColumnSmallIcons, {
        props: {
          title: mockProps.title,
          features: mockProps.features
        }
      });
      
      expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    });

    it('sanitizes HTML content', () => {
      const propsWithScript = {
        ...mockProps,
        subtitle: '<script>alert("xss")</script>Safe Content'
      };

      render(ThreeColumnSmallIcons, { props: propsWithScript });
      
      const subtitle = screen.getByText(/Safe Content/);
      expect(subtitle.textContent?.trim()).toMatch(/^Safe Content$/);
    });
  });
}); 