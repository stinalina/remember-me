import { test, expect, type Page } from '@playwright/test';

async function createNote(page: Page, content: string, subject: string): Promise<void> {
  await page.getByRole('button', { name: 'Notiz erstellen' }).click();
  await expect(page.getByRole('heading', { name: 'Erinnerung erstellen' })).toBeVisible();

    // Click in editor and add content
  const editor = page.locator('.ProseMirror');
  await editor.click();
  await editor.fill(content);

  page.locator('#create-notifcation-subject').fill(subject);

  await page.getByRole('button', { name: 'Änderungen speichern' }).click();
}

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
    expect(await ghostCards.count()).toBeGreaterThanOrEqual(5);
  });


  test('beim erstellen einer Note, sollte diese auftauchen und range sich auf 1 / 5 erhöhen', async ({ page }) => {
    await createNote( page, `Test Note ${Date.now()}`, 'Test Note Subject');

    const range = page.getByTestId('home-notifications-range');

    await expect(range).toHaveValue('1');
    await expect(range).toHaveAttribute('max', '5');
  });

  test('die neue Note sollte editierbar sein, im Dialog und vorausgefüllt öffnen. Änderungen werden anschließend korrekt dargestellt.', async ({ page }) => {
    await createNote(page, `Test Note ${Date.now()}`, 'Test Note Subject');

    const card = page.locator('.card', { has: page.getByRole('heading', { name: 'Test Note Subject' }) });
    await card.getByRole('button', { name: 'Notiz bearbeiten' }).click();

    await expect(page.getByRole('heading', { name: 'Erinnerung bearbeiten' })).toBeVisible();
    await expect(page.locator('#create-notifcation-subject')).toHaveValue('Test Note Subject');
    await expect(page.locator('.ProseMirror')).toContainText('Erster Inhalt');

    const updatedSubject = `Test Note Subject (aktualisiert)`;
    const updatedContent = 'Inhalt wurde aktualisiert';

    await page.locator('#create-notifcation-subject').fill(updatedSubject);
    await page.locator('.ProseMirror').click();
    await page.locator('.ProseMirror').fill(updatedContent);

    await page.getByRole('button', { name: 'Änderungen speichern' }).click();

    await expect(page.getByRole('heading', { name: updatedSubject })).toBeVisible();
    await expect(page.locator('.card', { has: page.getByRole('heading', { name: updatedSubject }) })).toContainText(updatedContent);
  });

  test('die neue note soll zu löschen gehen und verschwinden bei Passt!', async ({ page }) => {
    await createNote(page, `Loeschen ${Date.now()}`, 'Loeschen');

    const card = page.locator('.card', { has: page.getByRole('heading', { name: 'Loeschen' }) });
    await card.getByRole('button', { name: 'Notiz löschen' }).click();

    await page.getByRole('button', { name: 'Passt!' }).click();

    await expect(page.getByRole('heading', { name: 'Loeschen' })).toHaveCount(0);
  });
});
