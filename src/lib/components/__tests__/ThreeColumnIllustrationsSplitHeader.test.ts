import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ThreeColumnIllustrationsSplitHeader from '../ThreeColumnIllustrationsSplitHeader.svelte';
import customerService from '$lib/collections/incentives/customer-service.json';

describe('ThreeColumnIllustrationsSplitHeader', () => {
  const mockFeatures = [
    {
      icon: '/icons/feature1.svg',
      title: 'Feature 1',
      description: 'Description 1'
    },
    {
      icon: '/icons/feature2.svg',
      title: 'Feature 2',
      description: 'Description 2'
    }
  ];

  const mockProps = {
    dataTestid: 'test-header',
    title: 'Test Title',
    description: 'Test Description',
    imageUrl: '/test-image.jpg',
    features: mockFeatures
  };

  describe('rendering', () => {
    it('renders with default props from customerService', () => {
      render(ThreeColumnIllustrationsSplitHeader);
      
      expect(screen.getByText(customerService.title)).toBeInTheDocument();
      expect(screen.getByText(customerService.description)).toBeInTheDocument();
      
      const images = screen.getAllByRole('presentation');
      expect(images[0]).toHaveAttribute('src', customerService.imageUrl);
    });

    it('renders with custom props', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByTestId('test-header')).toBeInTheDocument();
    });

    it('renders all features correctly', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });

      mockFeatures.forEach((feature, index) => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
        expect(screen.getByText(feature.description)).toBeInTheDocument();
        const images = screen.getAllByRole('presentation');
        expect(images[index + 1]).toHaveAttribute('src', feature.icon);
      });
    });
  });

  describe('layout and structure', () => {
    it('maintains correct grid structure', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });
      
      const mainGrid = screen.getByTestId('test-header')
        .querySelector('.grid.grid-cols-1.items-center');
      expect(mainGrid).toBeInTheDocument();
      
      const featuresGrid = screen.getByTestId('test-header')
        .querySelector('.grid.grid-cols-1.gap-x-8');
      expect(featuresGrid).toBeInTheDocument();
    });

    it('applies correct responsive classes', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });
      
      const container = screen.getByTestId('test-header');
      expect(container).toHaveClass('bg-kohl');
      
      // Check responsive padding classes
      const innerContainer = container.querySelector('.py-24.sm\\:py-32');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Title');
      const images = screen.getAllByRole('presentation');
      expect(images[0]).toHaveAttribute('src', mockProps.imageUrl);
    });

    it('provides proper image alt text handling', () => {
      render(ThreeColumnIllustrationsSplitHeader, { props: mockProps });
      
      const images = screen.getAllByRole('presentation');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt', '');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty features array', () => {
      render(ThreeColumnIllustrationsSplitHeader, {
        props: { ...mockProps, features: [] }
      });
      
      const featuresGrid = screen.getByTestId('test-header')
        .querySelector('.grid.grid-cols-1.gap-x-8');
      expect(featuresGrid?.children.length).toBe(0);
    });

    it('uses default imageUrl when imageUrl prop is undefined', () => {
      render(ThreeColumnIllustrationsSplitHeader, {
        props: { ...mockProps, imageUrl: undefined }
      });
      
      const images = screen.getAllByRole('presentation');
      expect(images[0]).toHaveAttribute('src', customerService.imageUrl);
    });
  });
}); 