import { expect, test, type Page } from '@playwright/test';
import { FirebaseAuthHelper } from '../firebase-auth-helper.object';
import { Global } from '../global-helper.object';
import { HasuraHelper } from '../hasura-helper.object';

test.describe('Settings Page', () => {
	const testuserEmail = 'testuser@mail.de';
	const testuserPassword = 'test123';
	const initialUsername = 'testuser';
  const seededSubjectPrefix = 'e2e-is-archived';
  const initialPreferences = { avatarName: 'Kingston', subscribeReleaseMails: true };
  const updatedMail = 'testuser-e2e-update@mail.de';
  const updatedUsername = 'testuser-e2e-update';
  const updatedPassword = `test123-${Date.now()}`;

	const getNotificationCard = (page: Page, subject: string) =>
		page.locator('.card').filter({
			has: page.getByRole('heading', { name: subject, exact: true }),
		}).first();

	const loginAndOpenSettings = async (page: Page, email = testuserEmail, password = testuserPassword) => {
		await Global.login(page, email, password);
		await page.getByRole('button', { name: 'Einstellungen' }).click();
		await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
	};

	test.beforeEach(async ({ page }) => {
		await FirebaseAuthHelper.recreateUser(testuserEmail, testuserPassword);
		await HasuraHelper.resetUser({
			mail: testuserEmail,
			name: initialUsername,
			preferences: initialPreferences,
		});
		await loginAndOpenSettings(page);
	});

	test('zeigt die Settings-Maske mit deaktivierten Feldern initial an', async ({ page }) => {
		await expect(page.locator('#username-input')).toBeDisabled();
		await expect(page.locator('#default-mail-input')).toBeDisabled();
		await expect(page.locator('#password-input')).toBeDisabled();
	});

	test('Benutzername kann bearbeitet und per Abbrechen zurueckgesetzt werden', async ({ page }) => {
		const usernameInput = page.locator('#username-input');
		const usernameRow = page.locator('div.grid', { has: page.locator('#username-input') });
		const initialUsername = await usernameInput.inputValue();

		await page.getByRole('button', { name: 'Benutzernamen bearbeiten' }).click();
		await expect(usernameInput).toBeEnabled();

		await usernameInput.fill(`${initialUsername}_tmp`);
		await expect(usernameInput).toHaveValue(`${initialUsername}_tmp`);

		await usernameRow.getByRole('button', { name: 'Abbrechen' }).click();
		await expect(usernameInput).toBeDisabled();
		await expect(usernameInput).toHaveValue(initialUsername);
	});

	test('Benutzername kann geändert werden', async ({ page }) => {
		const usernameInput = page.locator('#username-input');
		const usernameRow = page.locator('div.grid', { has: page.locator('#username-input') });

		await usernameRow.getByRole('button', { name: 'Benutzernamen bearbeiten' }).click();
		await usernameInput.fill(updatedUsername);
		await usernameRow.getByRole('button', { name: 'Benutzernamen speichern' }).click();

		await expect(page.getByText('Benutzername erfolgreich gespeichert.')).toBeVisible();
		await expect(usernameInput).toHaveValue(updatedUsername);
	});

  test('Mail kann bearbeitet und per Abbrechen zurueckgesetzt werden', async ({ page }) => {
		const defaultMailInput = page.locator('#default-mail-input');
		const defaultMailRow = page.locator('div.grid', { has: page.locator('#default-mail-input') });
		const initialMail = await defaultMailInput.inputValue();

		await defaultMailRow.getByRole('button', { name: 'Standard-E-Mail bearbeiten' }).click();
		await expect(defaultMailInput).toBeEnabled();

		await defaultMailInput.fill(updatedMail);
			await expect(defaultMailInput).toHaveValue(updatedMail);

		await defaultMailRow.getByRole('button', { name: 'Abbrechen' }).click();
		await expect(defaultMailInput).toBeDisabled();
		await expect(defaultMailInput).toHaveValue(initialMail);
	});

	test('Standard-E-Mail kann geändert werden', async ({ page }) => {
		const defaultMailInput = page.locator('#default-mail-input');
		const defaultMailRow = page.locator('div.grid', { has: page.locator('#default-mail-input') });

		await defaultMailRow.getByRole('button', { name: 'Standard-E-Mail bearbeiten' }).click();
		await defaultMailInput.fill(updatedMail);
		await defaultMailRow.getByRole('button', { name: 'Standard-E-Mail speichern' }).click();

		await expect(page.getByText('Standard-E-Mail erfolgreich gespeichert.')).toBeVisible();
		await expect(defaultMailInput).toHaveValue(updatedMail);
	});

	test('beim Anlegen neuer Notes wird die Default-Mail aus den Settings verwendet', async ({ page }) => {
    const subject = `${seededSubjectPrefix}-default-mail-${Date.now()}`;
    const defaultMail = `default-mail-${Date.now()}@example.com`;
		const originalPreferences = await HasuraHelper.getUserPreferences(testuserEmail, initialPreferences);

    try {
			await HasuraHelper.updateUserPreferences({
				mail: testuserEmail,
				name: testuserEmail.split('@')[0],
				initialPreferences,
				preferences: {
					...originalPreferences,
					defaultMail,
				},
			});

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('div.py-4.grid > .card').first().click();
      await expect(page.getByRole('heading', { name: 'Erinnerung erstellen' })).toBeVisible();

      const mailInput = page.locator('#create-notifcation-mail');
      await expect(mailInput).toHaveValue(defaultMail);

      await page.locator('.ProseMirror').click();
      await page.locator('.ProseMirror').fill('Note mit Default-Mail aus den Settings');
      await page.locator('#create-notifcation-subject').fill(subject);
      await page.getByRole('button', { name: 'Notiz erstellen' }).click();

      await expect(getNotificationCard(page, subject)).toBeVisible();

	      const notifications = await HasuraHelper.getNotificationsBySubject(subject);
      expect(notifications).toHaveLength(1);
      expect(notifications[0]?.Mail).toBe(defaultMail);
    } finally {
	      await HasuraHelper.updateUserPreferences({
	        mail: testuserEmail,
	        name: testuserEmail.split('@')[0],
	        initialPreferences,
	        preferences: originalPreferences,
	      });
    }
  });

	test('Passwort kann gespeichert und mit dem neuen Wert genutzt werden', async ({ page }) => {
		const passwordInput = page.locator('#password-input');
		const passwordRow = page.locator('div.grid', { has: page.locator('#password-input') });

		await passwordRow.getByRole('button', { name: 'Passwort ändern' }).click();
		await passwordInput.fill(updatedPassword);
		await passwordRow.getByRole('button', { name: 'Passwort speichern' }).click();

		const openDialog = page.locator('dialog[open]');
		await expect(openDialog).toBeVisible();
		await expect(openDialog.getByRole('heading', { name: 'Passwort bestätigen' })).toBeVisible();
		await openDialog.locator('#current-password-input').fill(testuserPassword);
		await openDialog.locator('#settings-password-change-confirm').click();

		await expect(page.getByText('Passwort erfolgreich geändert.')).toBeVisible();

		await page.getByRole('button', { name: 'Abmelden' }).click();
		await expect(page).toHaveURL(/.*login/);

		await Global.login(page, testuserEmail, updatedPassword);
		await expect(page.getByTestId('home-username')).toHaveText('testuser');
	});

	test('Profil loeschen entfernt den User und verhindert anschliessendes Login', async ({ page }) => {
		await page.getByRole('button', { name: 'Profil löschen' }).click();

		const openDialog = page.locator('dialog[open]');
		await expect(openDialog).toBeVisible();
		await expect(openDialog.getByRole('heading', { name: 'Profil wirklich löschen?' })).toBeVisible();
		await openDialog.locator('#delete-account-password-input').fill(testuserPassword);
		await expect(openDialog.locator('#settings-deletion-confirm')).toBeVisible();

		await openDialog.locator('#settings-deletion-confirm').click();
		await expect(page).toHaveURL(/.*login/);
		await expect(page.getByText('Dein Profil wurde erfolgreich gelöscht.')).toBeVisible();

		await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
		await page.getByTestId('login-reme-password-input').fill(testuserPassword);
		await page.getByRole('button', { name: 'Einloggen' }).click();

		await expect(page).toHaveURL(/.*login/);
		await expect(page.getByText('Kein Benutzer mit dieser E-Mail-Adresse gefunden.')).toBeVisible();
	});
});
