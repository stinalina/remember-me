import { Preferences } from "@app/personal-space/data/preferences.model";

export interface Member {
  id: string;
  name: string;
  preferences: Preferences;
}