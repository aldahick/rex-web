import {
  action, computed, observable, toJS,
} from "mobx";
import { IRummikubCard } from "../graphql/types";

export class RummikubStore {
  @observable hand: IRummikubCard[] = [];

  @observable private _board: IRummikubCard[][] = [];

  @action.bound
  setHand(hand: IRummikubCard[]) {
    this.hand = hand;
  }

  @action.bound
  setBoard(board: IRummikubCard[][]) {
    console.log({ newBoard: board });
    this._board = board;
  }

  @computed
  get board() {
    return toJS(this._board).map(i => Object.values(i));
  }
}
