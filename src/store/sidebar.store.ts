import { action, makeObservable, observable } from "mobx";
import { singleton } from "tsyringe";

@singleton()
export class SidebarStore {
  @observable isOpen = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
  }
}
