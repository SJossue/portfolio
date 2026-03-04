import { expect, test } from '@playwright/test';

test('homepage loads fullscreen scene', async ({ page }) => {
  await page.goto('/');

  // Page has a main landmark
  await expect(page.locator('main')).toBeVisible();
});

test('home loads and shows intro controls', async ({ page }) => {
  await page.goto('/');

  // Terminal boot sequence plays before the AIR OUT button appears (~5s)
  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible({ timeout: 15000 });

  await expect(page.getByRole('button', { name: /skip intro/i })).toBeVisible();
});

test('skip intro shows garage UI shell', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /skip intro/i }).click();

  await expect(page.getByTestId('garage-shell')).toBeVisible();
});

test('air out triggers animation and shows garage shell', async ({ page }) => {
  await page.goto('/');

  // Wait for terminal boot sequence to finish before clicking
  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: /air out/i }).click();

  // Garage shell should appear after animation completes
  // GSAP animation + camera lerp — very generous timeout for CI
  await expect(page.getByTestId('garage-shell')).toBeVisible({ timeout: 15000 });
});

test('escape key skips intro', async ({ page }) => {
  await page.goto('/');

  // Wait for terminal boot to finish
  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible({ timeout: 15000 });

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

  // Wait for GSAP mount animation (0.4s) to settle
  await page.waitForTimeout(1000);

  // Close panel via Escape (bypasses GSAP close animation timing issues)
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible({ timeout: 5000 });
});

test('clicking About in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  await page.getByRole('button', { name: /about/i }).click();

  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();

  // Wait for GSAP mount animation to settle
  await page.waitForTimeout(1000);

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible({ timeout: 5000 });
});

test('clicking Contact in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  await page.getByRole('button', { name: /contact/i }).click();

  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();

  // Wait for GSAP mount animation to settle
  await page.waitForTimeout(1000);

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible({ timeout: 5000 });
});

test('Escape key closes overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();

  await page.getByRole('button', { name: /projects/i }).click();
  await expect(page.getByTestId('overlay-panel')).toBeVisible();

  // Wait for GSAP mount animation to settle
  await page.waitForTimeout(1000);

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible({ timeout: 5000 });
});

test('HUD bar has toolbar role for accessibility', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();

  const toolbar = page.getByRole('toolbar', { name: /navigation/i });
  await expect(toolbar).toBeVisible();
});
