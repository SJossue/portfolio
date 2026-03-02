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
