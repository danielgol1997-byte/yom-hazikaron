import { test, expect } from '@playwright/test';

test.describe('Mode picker', () => {
  test('shows mode picker on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#mode-picker')).toBeVisible();
    await expect(page.locator('#btn-projector')).toBeVisible();
    await expect(page.locator('#btn-controller')).toBeVisible();
    await expect(page.locator('#room-input')).toHaveValue('2026');
  });

  test('projector mode hides picker and shows slideshow', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-projector');
    await expect(page.locator('#mode-picker')).toBeHidden();
    await expect(page.locator('#slideshow')).toBeVisible();
  });

  test('controller mode hides picker and shows controller UI', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-controller');
    await expect(page.locator('#mode-picker')).toBeHidden();
    await expect(page.locator('#controller')).toBeVisible();
    await expect(page.locator('#ctrl-next')).toBeVisible();
    await expect(page.locator('#ctrl-prev')).toBeVisible();
  });

  test('controller next/prev buttons update slide counter', async ({ page }) => {
    // Mock the API so tests don't depend on network
    await page.route('/api/slide*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ slide: 0 }),
    }));

    await page.goto('/');
    await page.click('#btn-controller');

    const info = page.locator('#ctrl-slide-info');
    await expect(info).toHaveText('1 / 23');

    await page.click('#ctrl-next');
    await expect(info).toHaveText('2 / 23');

    await page.click('#ctrl-prev');
    await expect(info).toHaveText('1 / 23');
  });

  test('API route GET returns slide index', async ({ request }) => {
    const res = await request.get('/api/slide?room=test');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.slide).toBe('number');
  });

  test('API route POST updates slide index', async ({ request }) => {
    const res = await request.post('/api/slide?room=playwright-test', {
      data: { slide: 5 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.slide).toBe(5);

    const get = await request.get('/api/slide?room=playwright-test');
    const getBody = await get.json();
    expect(getBody.slide).toBe(5);
  });
});
