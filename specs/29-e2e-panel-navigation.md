# Feature: E2E Tests for All Panels and HUD Keyboard Nav

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add Playwright e2e tests covering the About panel, Contact panel, and HUD keyboard navigation. The existing e2e only tests the Projects panel.

### Files to modify (ONLY these files):

1. `e2e/home.spec.ts` — add new tests

### Instructions:

At the end of `e2e/home.spec.ts`, add the following tests:

```typescript
test('clicking About in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  await page.getByRole('button', { name: /about/i }).click();

  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();

  await page.getByTestId('close-panel').click();
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible();
});

test('clicking Contact in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  await page.getByRole('button', { name: /contact/i }).click();

  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();

  await page.getByTestId('close-panel').click();
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible();
});

test('Escape key closes overlay panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();

  await page.getByRole('button', { name: /projects/i }).click();
  await expect(page.getByTestId('overlay-panel')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible();
});

test('HUD bar has toolbar role for accessibility', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();

  const toolbar = page.getByRole('toolbar', { name: /navigation/i });
  await expect(toolbar).toBeVisible();
});
```

Do NOT change any existing tests or other files.

### Acceptance Criteria

- 4 new e2e tests added to `e2e/home.spec.ts`
- Tests cover About panel, Contact panel, Escape close, and toolbar a11y
- All existing tests continue to pass
- `npm run validate` passes
