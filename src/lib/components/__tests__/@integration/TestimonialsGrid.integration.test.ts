import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import TestimonialsGrid from '../../TestimonialsGrid.svelte';

const renderComponent = (props = {}) => {
  const result = render(TestimonialsGrid, { 
    props: {
      testimonials: [],
      ...props 
    }
  });
  flushSync();
  return result;
};

test('displays error message when error prop is provided', () => {
  const { getByRole } = renderComponent({
    error: 'Test error message',
    testimonials: []
  });

  const errorElement = getByRole('alert');
  expect(errorElement).toHaveTextContent('Unable to load testimonials at this time');
});

test('properly updates ARIA live regions', async () => {
  const { getByRole, rerender } = renderComponent({
    isLoading: true,
    testimonials: []
  });

  const loadingRegion = getByRole('status');
  expect(loadingRegion).toHaveAttribute('aria-live', 'polite');

  await rerender({ 
    isLoading: false, 
    testimonials: [],
    error: 'Error occurred'
  });
  
  const alertRegion = getByRole('alert');
  expect(alertRegion).toHaveTextContent('Unable to load testimonials at this time');
});

test('handles concurrent loading and error states correctly', async () => {
  const { getByRole, rerender } = renderComponent({
    isLoading: true,
    testimonials: []
  });

  const loadingRegion = getByRole('status');
  expect(loadingRegion).toBeInTheDocument();

  await rerender({
    isLoading: false,
    testimonials: [],
    error: 'Error loading testimonials'
  });

  const errorRegion = getByRole('alert');
  expect(errorRegion).toHaveTextContent('Unable to load testimonials at this time');
}); 