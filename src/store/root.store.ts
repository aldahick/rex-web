import { computed, makeObservable } from "mobx";
import { singleton } from "tsyringe";

import { ApolloStore } from "./apollo.store";
import { AuthStore } from "./auth.store";
import { SettingsStore } from "./settings.store";
import { SidebarStore } from "./sidebar.store";
import { StatusStore } from "./status.store";

@singleton()
export class RootStore {
  constructor(
    readonly authStore: AuthStore,
    readonly apolloStore: ApolloStore,
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
