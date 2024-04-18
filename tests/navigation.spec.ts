import { test, expect } from '@playwright/test';

test.describe('Main Navigation Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('Navigate to examples page', async ({ page }) => {
    await page.getByLabel('Global').getByRole('link', { name: 'Examples' }).click();
    await page.waitForURL('**/examples');
    expect(page.url()).toContain('/examples');

    await expect(page.locator('body')).toHaveText(/Example Workflows/);
  });

  test('Navigate to docs', async ({ page }) => {
    await page.getByLabel('Global').getByRole('link', { name: 'Docs' }).click();
    await page.waitForURL('https://docs.getsalt.ai/');

    expect(page.url()).toContain('https://docs.getsalt.ai/');
  });

  test('Navigate to blog', async ({ page }) => {
    await page.getByLabel('Global').getByRole('link', { name: 'Blog' }).click();
    await page.waitForURL('https://blog.getsalt.ai/');

    expect(page.url()).toContain('https://blog.getsalt.ai/');
  });

  test('Navigate to login page', async ({ page }) => {
    page.getByLabel('Global').getByRole('link', { name: 'Get started' }).click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');

    await expect(page.locator('body')).toHaveText(/Login or sign up/);
  });

  test('Navigate to login page from main button', async ({ page }) => {
    await page.getByText('Start for free').click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');

    await expect(page.locator('body')).toHaveText(/Login or sign up/);
  });
});

test.describe('Footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('Scrolls to deployments section', async ({ page }) => {
    await page.getByRole('link', { name: 'Deployments' }).click();
    const locator = page.getByText('From proof-of-concept to production-ready in seconds');

    await expect(locator).toBeInViewport();
  });

  test('Scrolls to editor section', async ({ page }) => {
    await page.getByRole('link', { name: 'Editor' }).click();
    const locator = page.getByText('An IDE designed with function in mind');

    await expect(locator).toBeInViewport();
  });

  test('Scrolls to infra section', async ({ page }) => {
    await page.getByRole('link', { name: 'Infra' }).click();
    const locator = page.getByText('High performance for you and your end user');

    await expect(locator).toBeInViewport();
  });

  test('Goes to examples', async ({ page }) => {
    await page.getByTitle('Examples').click();

    await page.waitForURL('**/examples');
    expect(page.url()).toContain('/examples');

    await expect(page.locator('body')).toHaveText(/Example Workflows/);
  });

  test('Goes to docs', async ({ page }) => {
    await page.getByTitle('Docs').click();

    await page.waitForURL('https://docs.getsalt.ai/');
    expect(page.url()).toContain('https://docs.getsalt.ai/');
  });

  test('Goes to github', async ({ page }) => {
    await page.getByRole('link', { name: 'Github', exact: true }).click();

    await page.waitForURL('https://github.com/get-salt-AI/SaltAI');
    expect(page.url()).toContain('https://github.com/get-salt-AI/SaltAI');
  });

  test('Scrolls to team section', async ({ page }) => {
    await page.getByRole('link', { name: 'Team' }).click();
    const locator = page.getByText('SALT TEAM');

    await expect(locator).toBeInViewport();
  });

  test('Navigate to about page', async ({ page }) => {
    await page.getByRole('link', { name: 'About' }).click();
    await page.waitForURL('**/about');
    expect(page.url()).toContain('/about');

    await expect(page.locator('body')).toHaveText(/Empowering Innovation/);
  });

  test('Navigate to blog', async ({ page }) => {
    await page.getByTitle('Blog').click();
    await page.waitForURL('https://blog.getsalt.ai/');

    expect(page.url()).toContain('https://blog.getsalt.ai/');
  });

  // @TODO: Mobile menu + footer icons
});
