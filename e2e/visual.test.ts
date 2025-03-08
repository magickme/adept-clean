import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Take screenshot of entire page
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2
    });
    
    // Test specific component
    const testimonials = page.getByTestId('testimonial-section');
    await expect(testimonials).toHaveScreenshot('testimonials.png');
  });
}); 