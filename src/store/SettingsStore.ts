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
  settings: Settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "false") || DEFAULT_SETTINGS;

  @action.bound
  setSettings(settings: Settings) {
    this.settings = settings;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }
}
