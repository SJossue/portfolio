import { expect, test } from '@playwright/test';

test('homepage renders the trifold hub', async ({ page }) => {
  await page.goto('/');

  // Page has a main landmark.
  await expect(page.locator('main')).toBeVisible();

  // Three panels: left profile rail, center stage, right details.
  await expect(page.getByRole('complementary', { name: /profile/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /selected island/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /island details/i })).toBeVisible();

  // The center stage carries the constant hero title and the island list.
  await expect(page.getByRole('heading', { level: 1, name: /jossue sarango/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /islands/i })).toBeVisible();
});

test('homepage ships no WebGL/canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();

  // The trifold hub replaced the WebGL Aurora/Particles background — nothing
  // on the homepage should mount a <canvas>.
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('selecting an island marks it current and reveals its Enter affordance', async ({ page }) => {
  await page.goto('/');

  const islands = page.getByRole('navigation', { name: /islands/i });
  const timeline = islands.getByRole('button', { name: /my timeline/i });

  // Focusing an island selects it (drives the accent + Enter affordance) without
  // diving in. Asserting aria-current waits for the selection state to settle.
  await timeline.focus();
  await expect(timeline).toHaveAttribute('aria-current', 'true');
  await expect(timeline).toContainText(/enter/i);
});

test('entering the selected island navigates to its world', async ({ page }) => {
  await page.goto('/');

  const islands = page.getByRole('navigation', { name: /islands/i });
  const timeline = islands.getByRole('button', { name: /my timeline/i });

  // Select first (wait for aria-current so the next key press enters, not selects).
  await timeline.focus();
  await expect(timeline).toHaveAttribute('aria-current', 'true');

  // Enter on the selected island dives into that world via router.push(slug).
  // The route compiles on demand in dev, so give the URL change a generous timeout.
  await timeline.press('Enter');
  await expect(page).toHaveURL(/\/timeline/, { timeout: 30000 });
});

test('panels stack into one vertical column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const profile = page.getByRole('complementary', { name: /profile/i });
  const stage = page.getByRole('region', { name: /selected island/i });
  const details = page.getByRole('region', { name: /island details/i });

  const [profileBox, stageBox, detailsBox] = await Promise.all([
    profile.boundingBox(),
    stage.boundingBox(),
    details.boundingBox(),
  ]);
  if (!profileBox || !stageBox || !detailsBox) {
    throw new Error('panel bounding boxes unavailable');
  }

  // Single column: on mobile the stage (hero + islands) leads, then the profile rail,
  // then the details footer — the primary content is first, not the nav/chat rail.
  expect(stageBox.y + stageBox.height).toBeLessThanOrEqual(profileBox.y + 1);
  expect(profileBox.y + profileBox.height).toBeLessThanOrEqual(detailsBox.y + 1);
  // …and each panel spans (near) the full viewport width — not side-by-side columns.
  for (const box of [profileBox, stageBox, detailsBox]) {
    expect(box.width).toBeGreaterThan(390 * 0.8);
  }
});
