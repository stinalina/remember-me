const firebaseProjectId = 'rememberme-d356c';
const firebaseAuthEmulatorUrl = 'http://127.0.0.1:9099';

export class FirebaseAuthHelper {
  public static async recreateUser(email: string, password: string): Promise<void> {
    await FirebaseAuthHelper.clearUsers();
    await FirebaseAuthHelper.createUser(email, password);
  }

  private static async clearUsers(): Promise<void> {
    const response = await fetch(
      `${firebaseAuthEmulatorUrl}/emulator/v1/projects/${firebaseProjectId}/accounts`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`Unable to clear Firebase Auth emulator users: ${errorPayload}`);
    }
  }

  private static async createUser(email: string, password: string): Promise<void> {
    const response = await fetch(
      `${firebaseAuthEmulatorUrl}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
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
      },
    );

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`Unable to seed Firebase Auth emulator user ${email}: ${errorPayload}`);
    }
  }
}