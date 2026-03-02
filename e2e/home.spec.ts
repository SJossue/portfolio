import { expect, test } from '@playwright/test';

test('homepage renders baseline section', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Baseline included' })).toBeVisible();
});
