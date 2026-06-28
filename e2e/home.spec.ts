import { expect, test } from '@playwright/test';

test('homepage renders the trifold hub', async ({ page }) => {
  await page.goto('/');

  // Page has a main landmark.
  await expect(page.locator('main')).toBeVisible();

  // Three glass panels are present (left list, center stage, right details).
  await expect(page.getByRole('complementary', { name: /islands/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /selected island/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /island details/i })).toBeVisible();
});

test('homepage ships no WebGL/canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();

  // The trifold hub replaced the WebGL Aurora/Particles background — nothing
  // on the homepage should mount a <canvas>.
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('selecting an island updates the center + details panels', async ({ page }) => {
  await page.goto('/');

  const list = page.getByRole('complementary', { name: /islands/i });
  const stage = page.getByRole('region', { name: /selected island/i });
  const details = page.getByRole('region', { name: /island details/i });

  // Default selection is the first island (Garage).
  await expect(stage.getByRole('heading', { name: /my garage/i })).toBeVisible();

  // Select Timeline from the left list.
  await list.getByRole('button', { name: /my timeline/i }).click();

  await expect(stage.getByRole('heading', { name: /my timeline/i })).toBeVisible();
  await expect(details.getByText(/MLT Tech Prep Fellow/i)).toBeVisible();
});

test('Enter navigates into the selected world', async ({ page }) => {
  await page.goto('/');

  const stage = page.getByRole('region', { name: /selected island/i });
  // Both the floating island visual and the explicit Enter button carry the
  // same accessible name; click the explicit button (last, and not animated).
  await stage
    .getByRole('button', { name: /enter my garage/i })
    .last()
    .click();

  // Existing WorldLoader flow fires immediately (status overlay), then
  // router.push('/garage'). The route is compiled on demand in dev, so give
  // the URL change a generous timeout.
  await expect(page.getByRole('status').filter({ hasText: /entering/i })).toBeVisible({
    timeout: 10000,
  });
  await expect(page).toHaveURL(/\/garage/, { timeout: 30000 });
});

test('panels stack into one column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const list = page.getByRole('complementary', { name: /islands/i });
  const stage = page.getByRole('region', { name: /selected island/i });
  const details = page.getByRole('region', { name: /island details/i });

  await expect(list).toBeVisible();
  await expect(stage).toBeVisible();

  // The details panel sits below the fold — reachable by scrolling.
  await details.scrollIntoViewIfNeeded();
  await expect(details).toBeVisible();
});
