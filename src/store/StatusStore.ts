import { action, makeObservable, observable } from "mobx";
import { singleton } from "tsyringe";

@singleton()
export class StatusStore {
  @observable successMessage?: string;

  @observable errorMessage?: string;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setSuccessMessage(message: string): void {
    if (message === this.successMessage) {
      this.successMessage += " ";
    } else {
      this.successMessage = message;
    }
  }

  @action.bound
  setErrorMessage(message: string): void {
    console.error("StatusStore.setErrorMessage", { message });
    if (message === this.errorMessage) {
      this.errorMessage += " ";
    } else {
      this.errorMessage = message;
    }
  }
}
