import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('successful enrollment flow', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    
    // Click enroll button
    await page.getByRole('link', { name: 'Enroll Now' }).click();
    
    // Verify redirect to pricing section
    await expect(page.getByTestId('pricing-section')).toBeVisible();
    
    // Select a pricing plan
    await page.getByRole('button', { name: 'Get started' }).first().click();
    
    // Verify checkout page
    await expect(page).toHaveURL(/.*checkout/);
  });
});