import { expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test';

const hasuraUrl = 'http://localhost:8081/v1/graphql';
const hasuraAdminSecret = 'mysecretkey';

export class HasuraHelper {
  public static async resetUser(options: {
    mail: string;
    name: string;
    preferences: Record<string, unknown>;
  }): Promise<void> {
    const userId = await HasuraHelper.ensureUserId(options);

    await HasuraHelper.graphqlRequest(
      `mutation ResetUser($id: uuid!, $name: String!, $preferences: jsonb!) {
        update_User(where: {Id: {_eq: $id}}, _set: {Name: $name, Preferences: $preferences}) {
          affected_rows
        }
      }`,
      {
        id: userId,
        name: options.name,
        preferences: options.preferences,
      },
    );
  }

  private static async withRequestContext<T>(
    callback: (requestContext: APIRequestContext) => Promise<T>,
  ): Promise<T> {
    const requestContext = await playwrightRequest.newContext();

    try {
      return await callback(requestContext);
    } finally {
      await requestContext.dispose();
    }
  }

  public static async graphqlRequest<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    return HasuraHelper.withRequestContext(async (requestContext) => {
      const response = await requestContext.post(hasuraUrl, {
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
    });
  }

  public static async ensureUserId(
    options: { mail: string; name: string; preferences: Record<string, unknown> },
  ): Promise<string> {
    const existingUser = await HasuraHelper.graphqlRequest<{
      User: { Id: string }[];
    }>(
      `query GetUserByMail($mail: String!) {
        User(where: {Mail: {_eq: $mail}}) {
          Id
        }
      }`,
      { mail: options.mail },
    );

    const currentUserId = existingUser.User[0]?.Id;
    if (currentUserId) {
      return currentUserId;
    }

    const insertedUser = await HasuraHelper.graphqlRequest<{
      insert_User: { returning: { Id: string }[] };
    }>(
      `mutation InsertUser($mail: String!, $name: String!, $preferences: jsonb!) {
        insert_User(objects: {Mail: $mail, Name: $name, Preferences: $preferences}) {
          returning {
            Id
          }
        }
      }`,
      options,
    );

    return insertedUser.insert_User.returning[0].Id;
  }

  public static async getUserPreferences(
    mail: string,
    fallbackPreferences: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const user = await HasuraHelper.graphqlRequest<{
      User: { Preferences: Record<string, unknown> }[];
    }>(
      `query GetUserPreferences($mail: String!) {
        User(where: {Mail: {_eq: $mail}}) {
          Preferences
        }
      }`,
      { mail },
    );

    return (user.User[0]?.Preferences ?? fallbackPreferences) as Record<string, unknown>;
  }

  public static async updateUserPreferences(
    options: {
      mail: string;
      name: string;
      initialPreferences: Record<string, unknown>;
      preferences: Record<string, unknown>;
    },
  ): Promise<void> {
    const userId = await HasuraHelper.ensureUserId({
      mail: options.mail,
      name: options.name,
      preferences: options.initialPreferences,
    });

    await HasuraHelper.graphqlRequest(
      `mutation UpdatePreferences($id: uuid!, $preferences: jsonb!) {
        update_User(where: {Id: {_eq: $id}}, _set: {Preferences: $preferences}) {
          affected_rows
        }
      }`,
      {
        id: userId,
        preferences: options.preferences,
      },
    );
  }

  public static async getNotificationsBySubject(
    subject: string,
  ): Promise<{
    Id?: string;
    Mail: string;
    IsArchived?: boolean;
    IsDraft?: boolean;
    DueDate?: string;
  }[]> {
    const result = await HasuraHelper.graphqlRequest<{
      Notification: {
        Id?: string;
        Mail: string;
        IsArchived?: boolean;
        IsDraft?: boolean;
        DueDate?: string;
      }[];
    }>(
      `query GetNotificationsBySubject($subject: String!) {
        Notification(where: {Subject: {_eq: $subject}}, order_by: {CreatedAt: asc}) {
          Id
          Mail
          IsArchived
          IsDraft
          DueDate
        }
      }`,
      { subject },
    );

    return result.Notification;
  }

  public static async deleteNotificationsBySubjectPattern(
    subjectPattern: string,
  ): Promise<void> {
    await HasuraHelper.graphqlRequest(
      `mutation DeleteNotifications($subjectPattern: String!) {
        delete_Notification(where: {
          Subject: {_like: $subjectPattern}
        }) {
          affected_rows
        }
      }`,
      { subjectPattern },
    );
  }

  public static async seedNotification(
    options: {
      userMail: string;
      userName: string;
      initialPreferences: Record<string, unknown>;
      subject: string;
      content: string;
      dueDate: string;
      isArchived?: boolean;
      isDraft?: boolean;
      mail?: string;
    },
  ): Promise<string> {
    const userId = await HasuraHelper.ensureUserId({
      mail: options.userMail,
      name: options.userName,
      preferences: options.initialPreferences,
    });

    const result = await HasuraHelper.graphqlRequest<{
      insert_Notification: { returning: { Id: string }[] };
    }>(
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
          IsDraft: options.isDraft ?? false,
          IsArchived: options.isArchived ?? false,
          UserId: userId,
          Mail: options.mail ?? options.userMail,
        },
      },
    );

    return result.insert_Notification.returning[0].Id;
  }
}
