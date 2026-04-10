// import { test, expect } from '@playwright/test';

// test.describe('RegisterComponent', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/register');
//     await page.waitForLoadState('networkidle');
//     });

//   test('should open dsgvo modal on clicking dsgvo', async ({ page }) => {
//     // Find the RegisterComponent and click the DSGVO link inside it
//     const registerComponent = page.locator('reme-register');
//     await registerComponent.getByText('DSGVO', {exact: true}).click();
    
//     // Wait for modal to open and check if it's visible
//     const modal = page.locator('#dsgvo');
//     await expect(modal).toBeVisible();
    
//     // Verify modal contains the expected title
//     const title = modal.locator('h1');
//     await expect(title).toContainText('Datenschutzerklärung');
//   });
 
//   test('should open agb modal on clicking agb', async ({ page }) => {
//     // Find the RegisterComponent and click the AGB link inside it
//     const registerComponent = page.locator('reme-register');
//     await registerComponent.getByText('AGB', {exact: true}).click();
    
//     // Wait for modal to open and check if it's visible
//     const modal = page.locator('#agb');
//     await expect(modal).toBeVisible();
    
//     // Verify modal contains the expected title
//     const title = modal.locator('h1');
//     await expect(title).toContainText('Allgemeine Geschäftsbedingungen');
//   });
// });