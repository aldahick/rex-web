import { action, observable } from "mobx";

export class StatusStore {
  @observable successMessage?: string;

  @observable errorMessage?: string;

  @action.bound
  setSuccessMessage(message: string) {
    if (message === this.successMessage) {
      this.successMessage += " ";
    } else {
      this.successMessage = message;
    }
  }

  @action.bound
  setErrorMessage(message: string) {
    if (message === this.errorMessage) {
      this.errorMessage += " ";
    } else {
      this.errorMessage = message;
    }
  }
}
