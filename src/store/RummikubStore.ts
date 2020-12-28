import {
  action, computed, observable, toJS,
} from "mobx";

import { IRummikubCard } from "../graphql/types";

export class RummikubStore {
  @observable hand: IRummikubCard[] = [];

  @observable playerId?: string;

  @observable private _board: IRummikubCard[][] = [];

  @action.bound
  setHand(hand: IRummikubCard[]): void {
    this.hand = hand;
  }

  @action.bound
  setBoard(board: IRummikubCard[][]): void {
    this._board = board;
  }

  @computed
  get board(): IRummikubCard[][] {
    return toJS(this._board).map(i => Object.values(i));
  }

  @action.bound
  setPlayerId(playerId: string): void {
    this.playerId = playerId;
  }
}
