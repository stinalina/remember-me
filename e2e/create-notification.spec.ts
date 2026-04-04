import { test, expect } from '@playwright/test';

test.describe('CreateNotificationComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/free-notification');
    // Clear localStorage after page loads
    await page.evaluate(() => localStorage.clear());
    await page.waitForTimeout(500);
  });

  test('should display placeholder on initial visit', async ({ page }) => {
    // Check that placeholder span is visible and contains text
    const placeholder = page.locator('.typewriter-placeholder');
    await expect(placeholder).toBeVisible();
    // Wait for animation to start and check it has content
    await page.waitForTimeout(1000);
    const placeholderText = await placeholder.textContent();
    expect(placeholderText).toBeTruthy();
    expect(placeholderText?.length).toBeGreaterThan(0);
  });

  test('should set date to tomorrow', async ({ page }) => {
    const dateInput = page.locator('#create-notification-date-time');
    const dateValue = await dateInput.inputValue();
    
    // Parse tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDate = tomorrow.toISOString().split('T')[0];
    
    expect(dateValue).toBe(expectedDate);
  });

  test('should disable button when component loads without input', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Notiz erstellen|Senden/ });
    const buttonClass = await submitButton.getAttribute('class');
    
    // Button should be disabled initially (no content, no email)
    expect(buttonClass).toContain('btn-disabled');
  });

  test('should enable button after filling all required fields', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const submitButton = page.getByRole('button', { name: /Notiz erstellen|Senden/ });
    
    // Fill email
    await mailInput.fill('test@example.com');
    
    // Click in editor and add content
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.fill('Test notification content');
    
    // Wait for form validation
    await page.waitForTimeout(300);
    
    // Check button is enabled
    const buttonClass = await submitButton.getAttribute('class');
    expect(buttonClass).not.toContain('btn-disabled');
  });

  test('should disable button when mail is deleted after being filled', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const editor = page.locator('.ProseMirror');
    const submitButton = page.getByRole('button', { name: /Notiz erstellen|Senden/ });
    
    // Fill all fields
    await mailInput.fill('test@example.com');
    await editor.click();
    await editor.fill('Test notification content');
    await page.waitForTimeout(300);
    
    // Clear mail
    await mailInput.clear();
    await page.waitForTimeout(300);
    
    // Button should be disabled
    const buttonClass = await submitButton.getAttribute('class');
    expect(buttonClass).toContain('btn-disabled');
  });

  test('should disable button when content is deleted after being filled', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const editor = page.locator('.ProseMirror');
    const submitButton = page.getByRole('button', { name: /Notiz erstellen|Senden/ });
    
    // Fill all fields
    await mailInput.fill('test@example.com');
    await editor.click();
    await editor.fill('Test notification content');
    await page.waitForTimeout(300);
    
    // Clear content
    await editor.clear();
    await page.waitForTimeout(300);
    
    // Button should be disabled
    const buttonClass = await submitButton.getAttribute('class');
    expect(buttonClass).toContain('btn-disabled');
  });

  test('should not allow selecting past or today date', async ({ page }) => {
    const dateInput = page.locator('#create-notification-date-time');
    
    // Get the min attribute (should be today or tomorrow)
    const minDate = await dateInput.getAttribute('min');
    expect(minDate).toBeTruthy();
    
    // Parse tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedMinDate = tomorrow.toISOString().split('T')[0];
    
    expect(minDate).toBe(expectedMinDate);
  });

  test('should restore email from localStorage on page reload', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    
    // Set a mail in localStorage after page loads
    const testEmail = 'cached@example.com';
    await page.evaluate((email) => {
      localStorage.setItem('user_mail', email);
    }, testEmail);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // Mail should be prefilled
    const mailValue = await mailInput.inputValue();
    expect(mailValue).toEqual(testEmail);
  });

  // Note: This needed hasura running in background
  test('should successfully create a notification with valid data', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const editor = page.locator('.ProseMirror');
    const submitButton = page.getByRole('button', { name: 'Notiz erstellen' });
    
    // Fill all fields with valid data
    const testEmail = `test-${Date.now()}@example.com`;
    await mailInput.fill(testEmail);
    await editor.click();
    await editor.fill('Test notification content for e2e testing');
    await page.waitForTimeout(500);
    
    // Click submit button
    await submitButton.click();
    
    // Wait for button to show "Senden..." state
    await expect(page.getByRole('button', { name: /Senden/ })).toBeVisible({ timeout: 3000 }).catch(() => {
      // If it doesn't show "Senden", that's okay - it might be quick
    });
    
    // Wait for submission to complete (button should return to normal or form resets)
    await page.waitForTimeout(3000);
    
    // Check that the notification was created by verifying the form was reset
    // The editor should be empty after successful submission
    const editorContent = await editor.evaluate((el) => {
      return el.textContent || '';
    });
    
    expect(editorContent.trim()).toBe('');
  });
});
