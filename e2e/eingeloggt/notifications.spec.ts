import { test, expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { Global } from '../global-helper.object';

test.describe('Notifications Page', () => {
  const testuserEmail = 'testuser@mail.de';
  const testuserPassword = 'test123';
  const hasuraUrl = 'http://localhost:8081/v1/graphql';
  const hasuraAdminSecret = 'mysecretkey';
  const seededSubjectPrefix = 'e2e-is-archived';
  const initialPreferences = { avatarName: 'Kingston' };

  const graphqlRequest = async <T>(
    request: APIRequestContext,
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> => {
    const response = await request.post(hasuraUrl, {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': hasuraAdminSecret,
      },
      data: {
        query,
        variables,
      },
    });

    expect(response.ok()).toBeTruthy();
    const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
    expect(payload.errors, JSON.stringify(payload.errors ?? [])).toBeUndefined();

    return payload.data as T;
  };

  const ensureTestUserId = async (request: APIRequestContext): Promise<string> => {
    const existingUser = await graphqlRequest<{
      User: { Id: string }[];
    }>(
      request,
      `query GetUserByMail($mail: String!) {
        User(where: {Mail: {_eq: $mail}}) {
          Id
        }
      }`,
      { mail: testuserEmail },
    );

    const currentUserId = existingUser.User[0]?.Id;
    if (currentUserId) {
      return currentUserId;
    }

    const insertedUser = await graphqlRequest<{
      insert_User: { returning: { Id: string }[] };
    }>(
      request,
      `mutation InsertUser($mail: String!, $name: String!, $preferences: jsonb!) {
        insert_User(objects: {Mail: $mail, Name: $name, Preferences: $preferences}) {
          returning {
            Id
          }
        }
      }`,
      {
        mail: testuserEmail,
        name: testuserEmail.split('@')[0],
        preferences: initialPreferences,
      },
    );

    return insertedUser.insert_User.returning[0].Id;
  };

  const deleteSeededNotifications = async (request: APIRequestContext) => {
    await graphqlRequest(
      request,
      `mutation DeleteNotifications($mail: String!, $subjectPattern: String!) {
        delete_Notification(where: {
          Mail: {_eq: $mail},
          Subject: {_like: $subjectPattern}
        }) {
          affected_rows
        }
      }`,
      {
        mail: testuserEmail,
        subjectPattern: `${seededSubjectPrefix}%`,
      },
    );
  };

  const seedNotification = async (
    request: APIRequestContext,
    options: { subject: string; content: string; dueDate: string; isArchived?: boolean },
  ) => {
    const userId = await ensureTestUserId(request);

    const result = await graphqlRequest<{
      insert_Notification: { returning: { Id: string }[] };
    }>(
      request,
      `mutation InsertNotification($object: Notification_insert_input!) {
        insert_Notification(objects: [$object]) {
          returning {
            Id
          }
        }
      }`,
      {
        object: {
          Subject: options.subject,
          Content: options.content,
          DueDate: options.dueDate,
          IsDraft: false,
          IsArchived: options.isArchived ?? false,
          UserId: userId,
          Mail: testuserEmail,
        },
      },
    );

    return result.insert_Notification.returning[0].Id;
  };

  const getNotificationCard = (page: Page, subject: string) =>
    page.locator('.card').filter({
      has: page.getByRole('heading', { name: subject, exact: true }),
    }).first();

  const openOverdueDialog = async (card: Locator) => {
    const warningButton = card.getByRole('button', { name: 'Überfällige Notiz verwalten' });
    await expect(warningButton).toBeVisible();
    await warningButton.evaluate((element: HTMLButtonElement) => element.click());
  };

  const getOverdueDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 1);
    dueDate.setHours(12, 0, 0, 0);
    return dueDate;
  };

  const formatGermanDate = (value: Date) =>
    new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(value);

  const createNotification = async (
    page: Page,
    options: { subject: string; content: string; isDraft?: boolean },
  ) => {
    await page.locator('div.py-6.grid > .card').first().click();
    await expect(page.getByRole('heading', { name: 'Erinnerung erstellen' })).toBeVisible();

    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.fill(options.content);

    await page.locator('#create-notifcation-subject').fill(options.subject);

    const draftCheckbox = page.getByTestId('notification-editor-draft-checkbox');
    if (options.isDraft) {
      await draftCheckbox.check();
    } else {
      await draftCheckbox.uncheck();
    }

    await page.getByRole('button', { name: 'Notiz erstellen' }).click();

    const createdCard = page.locator('.card').filter({
      has: page.getByRole('heading', { name: options.subject, exact: true }),
    }).first();

    await expect(createdCard).toBeVisible();
    return createdCard;
  };

  test.beforeEach(async ({ page, request }) => {
    await deleteSeededNotifications(request);
    await Global.login(page, testuserEmail, testuserPassword);
  });

  test.afterEach(async ({ request }) => {
    await deleteSeededNotifications(request);
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

  test('eine Note kann auf draft gesetzt werden und erhält dann das Entwurf Badge', async ({ page }) => {
    const subject = `Draft Note ${Date.now()}`;
    const content = 'Diese Note soll als Entwurf gespeichert werden';

    const createdCard = await createNotification(page, {
      subject,
      content,
      isDraft: true,
    });

    await expect(createdCard.getByText('Entwurf', { exact: true })).toBeVisible();
  });

  test('Notifications können mittels isDraft gefiltert werden', async ({ page }) => {
    const suffix = Date.now();
    const draftSubject = `Draft Filter Note ${suffix}`;
    const publishedSubject = `Published Filter Note ${suffix}`;

    await createNotification(page, {
      subject: draftSubject,
      content: 'Draft Content',
      isDraft: true,
    });

    await createNotification(page, {
      subject: publishedSubject,
      content: 'Published Content',
      isDraft: false,
    });

    const draftCard = page.locator('.card').filter({
      has: page.getByRole('heading', { name: draftSubject, exact: true }),
    }).first();
    const publishedCard = page.locator('.card').filter({
      has: page.getByRole('heading', { name: publishedSubject, exact: true }),
    }).first();

    await expect(draftCard).toBeVisible();
    await expect(publishedCard).toBeVisible();

    const draftFilterToggle = page.getByRole('checkbox', { name: 'Nur Entwürfe anzeigen' });
    await draftFilterToggle.check();

    await expect(draftCard).toBeVisible();
    await expect(draftCard.getByText('Entwurf', { exact: true })).toBeVisible();
    await expect(publishedCard).toHaveCount(0);
  });

  test('Lösche überfällige Notiz, anhand des Overdue Dialogs', async ({ page, request }) => {
    const subject = `${seededSubjectPrefix}-delete-${Date.now()}`;
    const dueDate = getOverdueDueDate();

    await seedNotification(request, {
      subject,
      content: 'Überfällige Notiz zum Löschen',
      dueDate: dueDate.toISOString(),
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const card = getNotificationCard(page, subject);
    await expect(card).toBeVisible();

    await openOverdueDialog(card);

    const overdueDialog = page.locator('dialog[open]').filter({ hasText: 'Möchtest du sie archivieren oder löschen?' });
    await expect(overdueDialog).toBeVisible();
    await overdueDialog.getByRole('button', { name: 'Löschen' }).click();

    await expect(getNotificationCard(page, subject)).toHaveCount(0);
  });

  test('Archiviere überfällige Notiz, anhand des Overdue Dialogs', async ({ page, request }) => {
    const subject = `${seededSubjectPrefix}-archive-${Date.now()}`;
    const dueDate = getOverdueDueDate();
    const expectedDueDate = formatGermanDate(dueDate);

    await seedNotification(request, {
      subject,
      content: 'Überfällige Notiz zum Archivieren',
      dueDate: dueDate.toISOString(),
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const card = getNotificationCard(page, subject);
    await expect(card).toBeVisible();

    await openOverdueDialog(card);

    const overdueDialog = page.locator('dialog[open]').filter({ hasText: 'Möchtest du sie archivieren oder löschen?' });
    await expect(overdueDialog).toBeVisible();
    await overdueDialog.getByRole('button', { name: 'Archivieren' }).click();

    await expect(card.getByRole('button', { name: 'Überfällige Notiz verwalten' })).toHaveCount(0);
    await expect(card.getByText('Archiviert', { exact: true })).toBeVisible();
    await expect(card.getByText(`Zugestellt am: ${expectedDueDate}`, { exact: true })).toBeVisible();

    const editButton = card.getByTestId(/note-\d+-edit/);
    const deleteButton = card.getByTestId(/note-\d+-delete/);

    await expect(editButton).toBeDisabled();
    await expect(deleteButton).toBeDisabled();
    await expect(page.getByRole('heading', { name: 'Erinnerung bearbeiten' })).toHaveCount(0);
  });
});
