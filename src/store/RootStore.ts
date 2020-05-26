import { computed } from "mobx";
import { SettingsStore } from "./SettingsStore";
import { StatusStore } from "./StatusStore";

export class RootStore {
  settingsStore = new SettingsStore();

  statusStore = new StatusStore();

  @computed
  get allStores(): Omit<RootStore, "allStores"> & { rootStore: Omit<RootStore, "allStores"> } {
    return {
      rootStore: this,
      ...this,
    };
  }
}
