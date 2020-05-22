import { computed } from "mobx";
import { SettingsStore } from "./SettingsStore";
import { StatusStore } from "./StatusStore";

export class RootStore {
  settingsStore = new SettingsStore();

  statusStore = new StatusStore();

  @computed
  get allStores() {
    return {
      rootStore: this,
      ...this,
    };
  }
}
