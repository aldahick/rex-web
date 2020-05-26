import { action, observable } from "mobx";

export class NavbarStore {
  @observable isOpen = false;

  @action.bound
  setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
  }
}
