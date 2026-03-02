import { expect, test } from '@playwright/test';

test('homepage renders correctly', async ({ page }) => {
  await page.goto('/');

  // Check main heading
  await expect(page.getByRole('heading', { name: /jossue/i })).toBeVisible();

  // Check description
  await expect(page.getByText(/a personal portfolio and engineering showcase/i)).toBeVisible();

  // Check architecture section
  await expect(page.getByRole('heading', { name: /architecture checks/i })).toBeVisible();
});
