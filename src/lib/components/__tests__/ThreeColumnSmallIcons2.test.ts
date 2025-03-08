import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ThreeColumnSmallIcons2 from '../ThreeColumnSmallIcons2.svelte';

describe('ThreeColumnSmallIcons2', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      description: 'Test Description',
      features: [
        {
          icon: '🎯',
          title: 'Feature 1',
          description: 'Description 1',
          linkText: 'Learn More',
          linkUrl: '/feature1'
        }
      ]
    };
  });

  describe('Basic Rendering', () => {
    it('renders core elements correctly', () => {
      render(ThreeColumnSmallIcons2, mockProps);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders feature elements correctly', () => {
      render(ThreeColumnSmallIcons2, mockProps);
      const feature = mockProps.features[0];
      
      expect(screen.getByText(feature.icon)).toBeInTheDocument();
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
      expect(screen.getByText(feature.linkText)).toBeInTheDocument();
      
      const link = screen.getByText(feature.linkText).closest('a');
      expect(link).toHaveAttribute('href', feature.linkUrl);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(ThreeColumnSmallIcons2, mockProps);
      
      expect(screen.getByLabelText('Section description')).toBeInTheDocument();
      expect(screen.getByLabelText('Feature list')).toBeInTheDocument();
      expect(screen.getByLabelText('Learn more about Feature 1')).toBeInTheDocument();
    });

    it('hides decorative elements from screen readers', () => {
      render(ThreeColumnSmallIcons2, mockProps);
      
      const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('maintains proper heading hierarchy', () => {
      render(ThreeColumnSmallIcons2, mockProps);
      
      const h2 = document.querySelector('h2');
      const h3 = document.querySelector('h3');
      expect(h2?.id).toBe('section-title');
      expect(h3?.getAttribute('aria-labelledby')).toBe('section-title');
    });
  });

  describe('HTML Sanitization', () => {
    it('allows permitted HTML tags', () => {
      const propsWithSafeHtml = {
        ...mockProps,
        subtitle: '<strong>Safe HTML</strong>',
        description: '<p>Safe paragraph</p>'
      };
      
      render(ThreeColumnSmallIcons2, propsWithSafeHtml);
      expect(document.querySelector('strong')?.textContent).toBe('Safe HTML');
      expect(document.querySelector('p')?.textContent).toBe('Safe paragraph');
    });

    it('removes dangerous HTML content', () => {
      const propsWithUnsafeHtml = {
        ...mockProps,
        subtitle: '<script>alert("xss")</script>Test',
        description: '<img src="x" onerror="alert(1)">Test'
      };
      
      render(ThreeColumnSmallIcons2, propsWithUnsafeHtml);
      expect(document.querySelector('script')).not.toBeInTheDocument();
      expect(document.querySelector('img[onerror]')).not.toBeInTheDocument();
    });

    it('strips disallowed HTML attributes', () => {
      const propsWithAttributes = {
        ...mockProps,
        subtitle: '<p onclick="alert(1)" style="color: red">Test</p>'
      };
      
      render(ThreeColumnSmallIcons2, propsWithAttributes);
      const element = document.querySelector('p');
      expect(element).not.toHaveAttribute('onclick');
      expect(element).not.toHaveAttribute('style');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty/undefined props gracefully', () => {
      render(ThreeColumnSmallIcons2, {});
      expect(screen.getByTestId('three-column-container')).toBeInTheDocument();
    });

    it('handles empty features array', () => {
      render(ThreeColumnSmallIcons2, { ...mockProps, features: [] });
      expect(document.querySelector('dl')).toBeInTheDocument();
      expect(document.querySelectorAll('dl > div').length).toBe(0);
    });
  });
}); 