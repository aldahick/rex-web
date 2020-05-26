import { action, observable } from "mobx";

export interface Settings {
  theme: "light" | "dark";
}

const SETTINGS_KEY = "rex.settings";
const DEFAULT_SETTINGS: Settings = {
  theme: "light",
};

export class SettingsStore {
  @observable
  private settings: Settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "false") || DEFAULT_SETTINGS;

  @action.bound
  setAll(settings: Settings): void {
    this.settings = settings;
    this.save();
  }

  @action.bound
  set<Key extends keyof Settings>(key: Key, value: Settings[Key]): void {
    this.settings[key] = value;
    this.save();
  }

  get<Key extends keyof Settings>(key: Key): Settings[Key] {
    return this.settings[key];
  }

  save() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }
}
