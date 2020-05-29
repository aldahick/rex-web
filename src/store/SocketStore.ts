import { action, observable } from "mobx";
import * as io from "socket.io-client";
import { Config } from "../Config";
import { RootStore } from "./RootStore";

export class SocketStore {
  @action.bound
  get isConnected() {
    return this.socket && this.socket.connected;
  }

  @observable socket!: SocketIOClient.Socket;

  constructor(
    root: RootStore,
  ) {
    const socket = io.connect(Config.apiUrl);
    socket.on("connect", () => {
      this.socket = socket;
    });
    socket.on("athena.error", (message: string) => {
      root.statusStore.setErrorMessage(message);
    });
  }
}
