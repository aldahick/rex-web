import { computed } from "mobx";
import { SettingsStore } from "./SettingsStore";

export class RootStore {
  settingsStore = new SettingsStore();

  @computed
  get allStores() {
    return {
      rootStore: this,
      ...this,
    };
  }
}
