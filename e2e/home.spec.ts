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
  await expect(page.getByTestId('garage-shell')).toBeVisible({ timeout: 15000 });
});

test('escape key skips intro', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByTestId('garage-shell')).toBeVisible();
});

test('clicking Projects in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');

  // Skip to garage
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  // Click Projects in HUD
  await page.getByRole('button', { name: /projects/i }).click();

  // Panel opens with Projects heading
  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();

  // Close panel
  await page.getByTestId('close-panel').click();
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible();
});
