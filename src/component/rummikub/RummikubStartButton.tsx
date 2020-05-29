import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";

export const RummikubStartButton: React.FC = () => {
  const { socketStore } = useStores();
  const [started, setStarted] = useState(false);

  const start = () => {
    socketStore.socket.emit("rummikub.client.start");
  };

  const onStart = () => {
    setStarted(true);
  };

  return (
    <SocketEvent name="rummikub.client.start" handle={onStart}>
      <Button onClick={start} variant="contained" disabled={started}>
        Start Game
      </Button>
    </SocketEvent>
  );
};
