import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { observer } from "mobx-react";
import { IRummikubServerTurnPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";

export const RummikubTurnButton: React.FC = observer(() => {
  const { socketStore, rummikubStore } = useStores();
  const [myTurn, setMyTurn] = useState(false);

  const onTurnData = (data: IRummikubServerTurnPayload) => {
    setMyTurn(data.player._id === rummikubStore.playerId);
  };

  const endTurn = () => {
    socketStore.socket.emit("rummikub.client.endTurn");
  };

  return (
    <SocketEvent name="rummikub.server.turn" handle={onTurnData}>
      <Button variant="outlined" onClick={endTurn} disabled={!myTurn}>
        End Turn
      </Button>
    </SocketEvent>
  );
});
