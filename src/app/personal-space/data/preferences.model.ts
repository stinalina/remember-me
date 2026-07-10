export interface Preferences {
    avatarName: string;
    defaultMail?: string;
    subscribeReleaseMails: boolean;
}

export const InitialPreferences: Preferences = {
    avatarName: 'Kingston',
    subscribeReleaseMails: true,
};