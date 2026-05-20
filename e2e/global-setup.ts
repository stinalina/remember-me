import type { FullConfig } from '@playwright/test';

const FIREBASE_PROJECT_ID = 'rememberme-d356c';
const FIREBASE_AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';
const TEST_USERS = [
  { email: 'testuser@mail.de', password: 'test123' },
];

async function waitForEmulator(maxAttempts = 30): Promise<void> {
  const endpoint = `${FIREBASE_AUTH_EMULATOR_URL}/emulator/v1/projects/${FIREBASE_PROJECT_ID}/config`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return;
      }
    } catch {
      // Ignore connection errors while emulator is booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('Firebase Auth emulator is not reachable for Playwright global setup.');
}

async function clearAuthUsers(): Promise<void> {
  const response = await fetch(
    `${FIREBASE_AUTH_EMULATOR_URL}/emulator/v1/projects/${FIREBASE_PROJECT_ID}/accounts`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to clear Firebase Auth emulator users: ${response.status} ${response.statusText}`);
  }
}

async function createAuthUser(email: string, password: string): Promise<void> {
  const response = await fetch(
    `${FIREBASE_AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: false,
      }),
    }
  );

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Unable to seed Firebase Auth emulator user ${email}: ${errorPayload}`);
  }
}

async function globalSetup(_config: FullConfig): Promise<void> {
  await waitForEmulator();
  await clearAuthUsers();

  for (const user of TEST_USERS) {
    await createAuthUser(user.email, user.password);
  }
}

export default globalSetup;
