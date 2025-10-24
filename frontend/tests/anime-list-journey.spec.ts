// frontend/tests/anime-list-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Full Anime List User Journey', () => {
    const animeToTrack = 'One Piece'; // A known anime for a consistent test

    test('should allow a user to search, add, update, and verify an anime', async ({ page }) => {
        // --- 1. SEARCH ---
        await page.goto('/search');
        await page.getByPlaceholder('e.g., Attack on Titan').fill(animeToTrack);
        await page.getByRole('button', { name: 'Search' }).click();
        const resultHeader = page.getByRole('heading', { name: animeToTrack });
        await expect(resultHeader).toBeVisible({ timeout: 10000 });
        await resultHeader.click();

        // --- 2. ADD TO LIST ---
        await expect(page).toHaveURL(/.*\/anime\/\d+/);
        const addToListDropdown = page.getByRole('combobox');
        await expect(addToListDropdown).toBeVisible();
        await addToListDropdown.selectOption('Watching');

        // --- 3. UPDATE PROGRESS ON DETAIL PAGE ---
        await expect(page.getByRole('heading', { name: 'My Progress' })).toBeVisible();
        const episodeCount = page.locator('.episode-tracker > span');

        // CORRECTED: Assert that the initial progress is 0.
        await expect(episodeCount).toHaveText(/0 \/ .*/);

        // NOW, we simulate the user watching the first episode.
        await page.getByRole('button', { name: '+' }).click();

        // CORRECTED: Assert that the progress is now 1.
        await expect(episodeCount).toHaveText(/1 \/ .*/);

        // --- 4. VERIFY ON DASHBOARD ---
        await page.goto('/dashboard');
        await expect(page.getByRole('heading', { name: 'My Anime Lists' })).toBeVisible();
        await page.getByRole('button', { name: 'Watching' }).click();
        const animeCard = page.locator('.anime-card-link', { hasText: animeToTrack });
        await expect(animeCard).toBeVisible();

        // CORRECTED: Verify the updated progress (1 episode) is saved correctly.
        await expect(animeCard).toContainText('1 /');
    });

    test('should display "No results found" for a non-existent anime', async ({ page }) => {
        const nonExistentAnime = 'NonExistentAnimeXYZ123';
        await page.goto('/search');
        await page.getByPlaceholder('e.g., Attack on Titan').fill(nonExistentAnime);
        await page.getByRole('button', { name: 'Search' }).click();
        const noResultsMessage = page.getByText(`No results found for "${nonExistentAnime}"`);
        await expect(noResultsMessage).toBeVisible();
    });
});