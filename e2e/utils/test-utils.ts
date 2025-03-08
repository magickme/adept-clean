import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
}

export async function enrollInCourse(page: Page, courseId: string) {
  await page.goto(`/courses/${courseId}`);
  await page.click('text=Enroll Now');
  // Add additional enrollment steps
} 