import { test, expect } from '@playwright/test';

test.describe('FreeNotificationComponent', () => {
  const testMail = `test-${Date.now()}@example.com`;

  test.beforeEach(async ({ page }) => {
    await page.goto('/free-notification');
    await page.waitForLoadState('networkidle');

    // Set notification count to 3 (limit) in localStorage after page loads
    await page.evaluate((testMail) => {
      localStorage.setItem('user_mail', testMail);
      localStorage.setItem(`sended_notifications_count_${testMail}`, '3_' + new Date().getMonth());
    }, testMail);
  });

  test('should show limit reached message after 3 notifications', async ({ page }) => {
    // Reload page
    await page.reload();
    await page.waitForTimeout(1500); // Wait for placeholder animation
    
    //Check that content in editir is cleared and editor is enabled
    const editorContent = await page.locator('.ProseMirror');
    expect(await editorContent.textContent()).toBe('');
    expect(await editorContent.isEnabled()).toBe(true);

    // Check that placeholder with limit message is shown
    const placeholder = page.locator('.typewriter-placeholder');
    await expect(placeholder).toBeVisible();
    const placeholderText = await placeholder.textContent();
    expect(placeholderText?.toLowerCase()).toContain('maxim');
    
    // Check that submit button is disabled
    const submitButton = page.getByRole('button', { name: /Notiz erstellen|Senden/ });
    const buttonClass = await submitButton.getAttribute('class');
    expect(buttonClass).toContain('btn-disabled');

    // Check that mail can be filled but editor is disabled
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    await expect(mailInput).toBeEnabled();
  });

  test('should restrict user to send more than limit allowed notifications', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const editor = page.locator('.ProseMirror');

    // Fill all fields with valid data
    await mailInput.fill(testMail);
    await editor.click();
    await editor.fill('Test notification content for e2e testing');
    await page.waitForTimeout(500);
    
    // Check if validtor hint shows free limit reached message
    const validatorHint = page.locator('.reme-validator-hint');
    await expect(validatorHint).toBeVisible();
    const hintText = await validatorHint.textContent();
    expect(hintText?.toLowerCase()).toContain('limit für kostenlose benachrichtigungen erreicht');
  });

  test('should send notification when limit is reached but new mail entered', async ({ page }) => {
    const mailInput = page.getByRole('textbox', { name: 'Sende Erinnerung an:' });
    const editor = page.locator('.ProseMirror');
    const submitButton = page.getByRole('button', { name: 'Notiz erstellen' });

    // Fill all fields with valid data
    await mailInput.fill('new@mail.de');
    await editor.click();
    await editor.fill('Test notification content for e2e testing');
    await page.waitForTimeout(500);
    
    // submit btn is enabled when new mail is entered
    let buttonClass = await submitButton.getAttribute('class');
    expect(buttonClass).not.toContain('btn-disabled');
  });
});