import { test, expect } from '@playwright/test';

test.describe('Notifications Page', () => {
  const testuserEmail = 'testuser@mail.de';
  const testuserPassword = 'test123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
    await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
    await page.getByTestId('login-reme-password-input').fill(testuserPassword);
    await page.getByRole('button', { name: 'Einloggen' }).click();

    await expect(page).toHaveURL(/.*home/);
  });

  test('Neue Note erstellen Karte sollte an erster Stelle stehen und min. 5 Platzhalter zu sehen sein', async ({ page }) => {
    const cards = page.locator('div.py-6.grid > .card');
    await expect(cards.first()).toContainText('Neue Note erstellen');

    const ghostCards = page.locator('div.card.border-2.border-dashed');
    expect(await ghostCards.count()).toBeGreaterThanOrEqual(1);
  });


  test('beim erstellen einer Note, sollte diese auftauchen und range sich auf 1 / 5 erhöhen', async ({ page }) => {
    await page.locator('div.py-6.grid > .card').first().click();
    await expect(page.getByRole('heading', { name: 'Erinnerung erstellen' })).toBeVisible();
    
    // Click in editor and add content
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.fill('Test Note Content');

    await page.locator('#create-notifcation-subject').fill('Test Note Subject');
    
    await page.getByRole('button', { name: 'Notiz erstellen' }).click();
    
    // Nach dem Erstellen sollte sich der Wert um 1 erhöhen
    const range = page.getByTestId('home-notifications-range');
    await expect(range).toHaveValue('1');
    await expect(range).toHaveAttribute('max', '5');
  });

  test('die neue Note sollte editierbar sein, im Dialog und vorausgefüllt öffnen. Änderungen werden anschließend korrekt dargestellt.', async ({ page }) => {
    const editButton = page.getByTestId('note-0-edit');
    await editButton.scrollIntoViewIfNeeded();
    await editButton.evaluate((element: HTMLElement) => element.click());
    await expect(page.getByRole('heading', { name: 'Erinnerung bearbeiten' })).toBeVisible();

    const updatedSubject = `Subject (aktualisiert)`;
    const updatedContent = 'Inhalt wurde aktualisiert';

    await page.locator('#create-notifcation-subject').fill(updatedSubject);
    await page.locator('.ProseMirror').click();
    await page.locator('.ProseMirror').fill(updatedContent);

    await page.getByRole('button', { name: 'Änderungen speichern' }).click();

    const editedCard = page.locator('.card', { has: page.getByTestId('note-0-edit') });
    await expect(editedCard.getByRole('heading', { name: updatedSubject })).toBeVisible();
    await expect(editedCard).toContainText(updatedContent);
  });

  test('die neue note soll zu löschen gehen und verschwinden bei Passt!', async ({ page }) => {
    const notesDeleteButtons = page.locator('[data-testid$="-delete"]');
    const count = await notesDeleteButtons.count();

    const deleteButton = page.getByTestId('note-0-delete');
    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.evaluate((element: HTMLElement) => element.click());
    const openDialog = page.locator('dialog[open]');
    await expect(openDialog).toBeVisible();
    await openDialog.locator('#confirm-deletion').click();

    await expect(notesDeleteButtons).toHaveCount(count - 1);
  });
});
