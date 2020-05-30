import {
  action, computed, observable, toJS,
} from "mobx";
import { IRummikubCard } from "../graphql/types";

export class RummikubStore {
  @observable hand: IRummikubCard[] = [];

  @action.bound
  setHand(hand: IRummikubCard[]) {
    this.hand = hand;
  }

  @observable private _board: IRummikubCard[][] = [];

  @action.bound
  setBoard(board: IRummikubCard[][]) {
    this._board = board;
  }

  @computed
  get board() {
    return toJS(this._board).map(i => Object.values(i));
  }

  @observable playerId?: string;

  @action.bound
  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }
}
