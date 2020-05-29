import { computed } from "mobx";
import { NavbarStore } from "./NavbarStore";
import { SettingsStore } from "./SettingsStore";
import { SocketStore } from "./SocketStore";
import { StatusStore } from "./StatusStore";

export class RootStore {
  navbarStore = new NavbarStore();

  settingsStore = new SettingsStore();

  socketStore = new SocketStore();

  statusStore = new StatusStore();

  @computed
  get allStores(): Omit<RootStore, "allStores"> & { rootStore: Omit<RootStore, "allStores"> } {
    return {
      rootStore: this,
      ...this,
    };
  }
}
