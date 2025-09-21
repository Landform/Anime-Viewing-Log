import { test, expect } from '@playwright/test';

test('User can register, navigate to search, and see results', async ({ page }) => {
  // Generate a unique username and email for each test run to prevent conflicts
  const uniqueUsername = `testuser_${Date.now()}`;
  const uniqueEmail = `test_${Date.now()}@example.com`;
  const password = 'a-very-secure-password-123';

  // --- 1. Registration Phase ---
  // Start at the root, which should redirect to the login page
  await page.goto('/');

  // Find the "Register" link and click it.
  // Note: The link contains a button, so we target the link itself.
  await page.getByRole('link', { name: 'Sign up' }).click();

  // Assert that we are on the registration page
  await expect(page).toHaveURL('/register');

  // Fill out the registration form
  await page.getByPlaceholder('Enter your username').fill(uniqueUsername);
  await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
  await page.getByPlaceholder('Enter your password').fill(password);

  // Click the "Register" button
  await page.getByRole('button', { name: 'Register' }).click();

  // --- 2. Dashboard & Navigation Phase ---
  // Assert that after registration, we are redirected to the dashboard
  await expect(page).toHaveURL('/dashboard');

  // Assert that we can see a key element of the dashboard
  await expect(page.getByRole('heading', { name: 'My Anime Lists' })).toBeVisible();

  // Find the "Search" link in the topbar and click it
  await page.getByRole('link', { name: 'Search' }).click();

  // --- 3. Search Phase ---
  // Assert that we've been taken to the search results page
  await expect(page).toHaveURL('/search');

  // Find the search bar, fill it with a known anime from our database, and submit
  const searchInput = page.getByPlaceholder('e.g., Attack on Titan');
  await searchInput.fill('Attack on Titan');
  await page.getByRole('button', { name: 'Search' }).click();

  // The most important check: Assert that the search result is now visible on the page.
  // Playwright's 'expect' will automatically wait for a few seconds for the API call to finish.
  await expect(page.getByRole('heading', { name: 'Attack on Titan' })).toBeVisible();
});