import { test, expect } from '@playwright/test';

test('User can register, log in, and search for an anime', async ({ page }) => {
  // We need a unique username for each test run to avoid "user already exists" errors
  const uniqueUsername = `testuser_${Date.now()}`;
  const uniqueEmail = `test_${Date.now()}@example.com`;

  // --- 1. Registration Phase ---
  await page.goto('/'); // Go to the homepage of our React app

  // Find the "Sign Up" link and click it.
  await page.getByRole('link', { name: 'Sign Up' }).click();

  // Assert that we are on the registration page.
  await expect(page).toHaveURL('/register');

  // Fill out the registration form.
  await page.getByPlaceholder('Username').fill(uniqueUsername);
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('a-very-secure-password-123');

  // Click the "Register" button.
  await page.getByRole('button', { name: 'Register' }).click();

  // Assert that after registration, we are redirected to the dashboard.
  await expect(page).toHaveURL('/dashboard');
  // Assert that we can see the main dashboard title.
  await expect(page.getByRole('heading', { name: 'My Anime Lists' })).toBeVisible();


  // --- 2. Search Phase ---
  // Find the search bar and fill it in.
  await page.getByPlaceholder('Search for an anime...').fill('Attack on Titan');

  // Simulate pressing the "Enter" key to submit the search.
  await page.keyboard.press('Enter');

  // Assert that we've been taken to the search results page.
  await expect(page).toHaveURL(/.*search/); // The ".*" is a wildcard

  // The most important check: Assert that the text "Attack on Titan" is now visible on the page.
  await expect(page.getByText('Attack on Titan')).toBeVisible();
});