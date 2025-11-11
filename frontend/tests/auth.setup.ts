// frontend/tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // <-- ADD THIS IMPORT

// --- THIS IS THE MODERN REPLACEMENT FOR __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------------------------------------

// --- START DEBUGGING BLOCK ---
const envPath = path.resolve(__dirname, '../../.env');
console.log('>>> [DEBUG] CWD:', process.cwd());
console.log('>>> [DEBUG] __dirname:', __dirname);
console.log('>>> [DEBUG] Attempting to load .env from:', envPath);
// --- END DEBUGGING BLOCK ---

// Now this line will work correctly because we have defined __dirname ourselves.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const authFile = 'playwright/.auth/user.json';

setup('authenticate as user', async ({ page }) => {
    const username = process.env.TEST_USER_NAME;
    const password = process.env.TEST_USER_PASSWORD;
    if (!username || !password) {
        throw new Error('Test credentials are not defined in the .env file.');
    }

    await page.goto('/login');
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // IMPORTANT: Wait for a post-login element to appear.
    await expect(page.getByRole('heading', { name: 'My Anime Lists' })).toBeVisible();

    await page.context().storageState({ path: authFile });
});