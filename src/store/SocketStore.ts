import { action, observable } from "mobx";

export class SocketStore {
  @observable rummikub?: SocketIOClient.Socket;

  @action.bound
  setRummikub(socket: SocketIOClient.Socket) {
    this.rummikub = socket;
  }
}
