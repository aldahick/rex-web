import { computed, makeObservable } from "mobx";
import { singleton } from "tsyringe";

import { SettingsStore } from "./SettingsStore";
import { SidebarStore } from "./SidebarStore";
import { StatusStore } from "./StatusStore";

@singleton()
export class RootStore {
  constructor(
    readonly settingsStore: SettingsStore,
    readonly sidebarStore: SidebarStore,
    readonly statusStore: StatusStore
  ) {
    makeObservable(this);
  }

  @computed
  get allStores(): Omit<RootStore, "allStores"> & { rootStore: Omit<RootStore, "allStores"> } {
    return {
      rootStore: this,
      ...this,
    };
  }
}
