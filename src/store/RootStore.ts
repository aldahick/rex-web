import { computed } from "mobx";
import { NavbarStore } from "./NavbarStore";
import { RummikubStore } from "./RummikubStore";
import { SettingsStore } from "./SettingsStore";
import { SocketStore } from "./SocketStore";
import { StatusStore } from "./StatusStore";

export class RootStore {
  navbarStore = new NavbarStore();

  rummikubStore = new RummikubStore();

  settingsStore = new SettingsStore();

  socketStore = new SocketStore(this);

  statusStore = new StatusStore();

  @computed
  get allStores(): Omit<RootStore, "allStores"> & { rootStore: Omit<RootStore, "allStores"> } {
    return {
      rootStore: this,
      ...this,
    };
  }
}
