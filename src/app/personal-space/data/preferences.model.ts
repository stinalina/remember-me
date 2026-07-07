export interface Preferences {
    avatarName: string;
    defaultMail?: string;
    subscribeReleaseMails: boolean; //TODO Hasura default value
}

export const InitialPreferences: Preferences = {
    avatarName: 'Kingston',
    subscribeReleaseMails: true,
};