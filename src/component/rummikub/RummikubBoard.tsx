import { observer } from "mobx-react";
import React from "react";

import { IRummikubServerBoardPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";
import { RummikubCards } from "./RummikubCards";

export const RummikubBoard: React.FC = observer(() => {
  const { rummikubStore } = useStores();

  const onBoardData = (data: IRummikubServerBoardPayload) => {
    console.log({ board: data.board });
    rummikubStore.setBoard(data.board);
  };

  return (
    <SocketEvent name="rummikub.server.board" handle={onBoardData}>
      <div>
        {rummikubStore.board.map((cards, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <RummikubCards key={`board-${i}`} dropId={`board-${i}`} cards={cards} />
        ))}
        <RummikubCards placeholder dropId="placeholder" cards={[]} />
      </div>
    </SocketEvent>
  );
});
