import React, { useState } from "react";
import { Grid, Hidden, makeStyles } from "@material-ui/core";
import * as _ from "lodash";
import { observer } from "mobx-react";
import {
  DragDropContext, DropResult,
} from "react-beautiful-dnd";
import { useRouteMatch } from "react-router";
import { RummikubBoard } from "../../component/rummikub/RummikubBoard";
import { RummikubChat } from "../../component/rummikub/RummikubChat";
import { RummikubHand } from "../../component/rummikub/RummikubHand";
import { RummikubJoinForm } from "../../component/rummikub/RummikubJoinForm";
import { RummikubPlayers } from "../../component/rummikub/RummikubPlayers";
import { RummikubStartButton } from "../../component/rummikub/RummikubStartButton";
import { RummikubTurnButton } from "../../component/rummikub/RummikubTurnButton";
import { IRummikubCard } from "../../graphql/types";
import { useStores } from "../../hook/useStores";

const useStyles = makeStyles({
  dragContainer: {
    paddingLeft: "2em",
    paddingRight: "2em",
  },
  fieldContainer: {
    height: "100%",
  },
  boardContainer: {
    flexGrow: 1,
  },
  chatContainer: {
    flexGrow: 1,
    maxWidth: "unset",
  },
});

export const RummikubGameScene: React.FC = observer(() => {
  const { params: { gameId } } = useRouteMatch<{ gameId: string }>();
  const { rummikubStore } = useStores();
  const [joined, setJoined] = useState(false);
  const classes = useStyles();

  const getCardRow = (dropId: string) => {
    if (dropId.startsWith("board-")) {
      const index = Number(dropId.split("-")[1]);
      return rummikubStore.board[index];
    }
    if (dropId === "placeholder") {
      return [];
    }
    if (dropId === "hand") {
      return rummikubStore.hand;
    }
    throw new Error(`Unknown dropId ${dropId}`);
  };

  const setCardRow = (dropId: string, row: IRummikubCard[]) => {
    if (dropId.startsWith("board-")) {
      const index = Number(dropId.split("-")[1]);
      const boardClone = _.cloneDeep(rummikubStore.board);
      boardClone.splice(index, 1, row);
      rummikubStore.setBoard(boardClone);
    } else if (dropId === "placeholder") {
      rummikubStore.setBoard(rummikubStore.board.concat([row]));
    } else if (dropId === "hand") {
      rummikubStore.setHand(row);
    } else {
      throw new Error(`Unknown dropId ${dropId}`);
    }
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const fromId = source.droppableId;
    const toId = destination.droppableId;
    const sameRow = fromId === toId;

    const fromRow = _.cloneDeep(getCardRow(fromId));
    const toRow = _.cloneDeep(getCardRow(toId));

    const [card] = fromRow.splice(source.index, 1);
    (sameRow ? fromRow : toRow).splice(destination.index, 0, card);

    console.log({ fromRow, toRow });
    setCardRow(fromId, fromRow);
    if (!sameRow) {
      setCardRow(toId, toRow);
    }
  };

  if (!joined) {
    return (
      <RummikubJoinForm gameId={gameId} onJoin={() => setJoined(true)} />
    );
  }

  return (
    <Grid container>
      <Hidden smDown>
        <Grid item>
          <Grid container direction="column" justify="space-between">
            <RummikubPlayers />
            <RummikubStartButton />
            <RummikubTurnButton />
          </Grid>
        </Grid>
      </Hidden>
      <Grid item className={classes.dragContainer}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            className={classes.fieldContainer}
          >
            <Grid item className={classes.boardContainer}>
              <RummikubBoard />
            </Grid>
            <Grid item>
              <RummikubHand />
            </Grid>
          </Grid>
        </DragDropContext>
      </Grid>
      <Grid item sm={3} md={2} className={classes.chatContainer}>
        <Grid container justify="flex-end">
          <Grid item>
            <RummikubChat />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
