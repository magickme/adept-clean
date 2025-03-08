import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import TestimonialsGrid from '../TestimonialsGrid.svelte';

const renderComponent = (props = {}) => {
  const result = render(TestimonialsGrid, { props });
  flushSync();
  return result;
};

test('Error Handling > handles non-array testimonials input', () => {
  const { getByRole } = renderComponent({ 
    testimonials: 'not-an-array' as any 
  });

  const errorElement = getByRole('alert');
  expect(errorElement).toHaveTextContent('Unable to load testimonials at this time');
});

test('Error Handling > handles invalid testimonial data gracefully', () => {
  const { getByRole } = renderComponent({
    testimonials: [{ invalid: 'data' }]
  });

  const errorElement = getByRole('alert');
  expect(errorElement).toHaveTextContent('No testimonials are available at this time');
});

test('Error Handling > provides user-friendly error messages', async () => {
  const { getByRole, rerender } = renderComponent({
    testimonials: null as any
  });
  
  const errorElement = getByRole('alert');
  expect(errorElement).toHaveTextContent('Unable to load testimonials at this time');

  await rerender({ testimonials: [{}] });
  const updatedErrorElement = getByRole('alert');
  expect(updatedErrorElement).toHaveTextContent('No testimonials are available at this time');
});

test('Loading States > handles concurrent loading and error states correctly', async () => {
  const { getByRole, rerender } = renderComponent({
    isLoading: true,
    testimonials: []
  });

  const loadingElement = getByRole('status');
  expect(loadingElement).toHaveAttribute('aria-busy', 'true');

  await rerender({
    isLoading: false,
    testimonials: 'invalid' as any
  });

  const errorElement = getByRole('alert');
  expect(errorElement).toHaveTextContent('Unable to load testimonials at this time');
}); 