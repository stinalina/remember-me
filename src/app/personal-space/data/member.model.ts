import { Preferences } from "@app/personal-space/data/preferences.model";
import { Stats } from "@app/personal-space/data/stats.model";

export interface Member {
  id: string;
  name: string;
  preferences: Preferences;
  stats: Stats;
}