import { expect, test } from '@playwright/test';

test('homepage loads fullscreen scene', async ({ page }) => {
  await page.goto('/');

  // Page has a main landmark
  await expect(page.locator('main')).toBeVisible();
});

test('home loads and shows intro controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible();

  await expect(page.getByRole('button', { name: /skip intro/i })).toBeVisible();
});

test('skip intro shows garage UI shell', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /skip intro/i }).click();

  await expect(page.getByTestId('garage-shell')).toBeVisible();
});

test('air out triggers animation and shows garage shell', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /air out/i }).click();

  // Garage shell should appear after animation completes
  // Animation takes ~1.2s (air out) + camera lerp time
  await expect(page.getByTestId('garage-shell')).toBeVisible({ timeout: 10000 });
});
